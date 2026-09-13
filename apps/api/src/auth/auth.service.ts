import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHmac, randomInt, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthEmailService } from './auth-email.service';
import { RequestLoginCodeDto } from './dto/request-login-code.dto';
import { VerifyLoginCodeDto } from './dto/verify-login-code.dto';

const CODE_TTL_MINUTES = 10;
const CODE_RESEND_COOLDOWN_MS = 60_000;
const MAX_CODE_ATTEMPTS = 5;

export interface AuthResult {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    country: string | null;
    industry: string | null;
    jobTitle: string | null;
    role: string;
    onboardingCompletedAt: Date | null;
    marketProfile: {
      regionCity: string | null;
      currency: string | null;
      procurementCategories: string[];
      commodities: string[];
      purchaseMix: string | null;
      sourcingCountries: string[];
      tradeLanes: string[];
      procurementChallenges: string[];
    } | null;
  };
}

export interface LoginCodeRequestedResult {
  message: string;
  expiresInSeconds: number;
  developmentCode?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly email: AuthEmailService,
  ) {}

  async requestLoginCode(dto: RequestLoginCodeDto): Promise<LoginCodeRequestedResult> {
    const email = this.normalizeEmail(dto.email);
    const now = new Date();
    const previous = await this.prisma.passwordlessLoginCode.findUnique({ where: { email } });

    if (previous && now.getTime() - previous.createdAt.getTime() < CODE_RESEND_COOLDOWN_MS) {
      throw new HttpException('Please wait one minute before requesting another code', HttpStatus.TOO_MANY_REQUESTS);
    }

    const code = String(randomInt(100_000, 1_000_000));
    const codeHash = this.hashCode(email, code);
    const expiresAt = new Date(now.getTime() + CODE_TTL_MINUTES * 60_000);

    await this.prisma.passwordlessLoginCode.upsert({
      where: { email },
      update: { codeHash, expiresAt, attempts: 0, consumedAt: null, createdAt: now },
      create: { email, codeHash, expiresAt },
    });

    let delivered: boolean;
    try {
      delivered = await this.email.sendLoginCode(email, code);
    } catch (error) {
      await this.prisma.passwordlessLoginCode.deleteMany({ where: { email, codeHash } });
      throw error;
    }

    return {
      message: 'A verification code has been sent to your email address',
      expiresInSeconds: CODE_TTL_MINUTES * 60,
      ...(!delivered && this.config.get<string>('NODE_ENV') !== 'production' ? { developmentCode: code } : {}),
    };
  }

  async verifyLoginCode(dto: VerifyLoginCodeDto): Promise<AuthResult> {
    const email = this.normalizeEmail(dto.email);
    const record = await this.prisma.passwordlessLoginCode.findUnique({ where: { email } });
    const now = new Date();

    if (!record || record.consumedAt || record.expiresAt <= now || record.attempts >= MAX_CODE_ATTEMPTS) {
      throw new UnauthorizedException('The verification code is invalid or has expired');
    }

    const suppliedHash = this.hashCode(email, dto.code);
    const matches = timingSafeEqual(Buffer.from(record.codeHash, 'hex'), Buffer.from(suppliedHash, 'hex'));

    if (!matches) {
      await this.prisma.passwordlessLoginCode.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException('The verification code is invalid or has expired');
    }

    const user = await this.prisma.$transaction(async (transaction) => {
      const consumed = await transaction.passwordlessLoginCode.deleteMany({
        where: { id: record.id, codeHash: record.codeHash, consumedAt: null, expiresAt: { gt: now } },
      });
      if (consumed.count !== 1) {
        throw new UnauthorizedException('The verification code is invalid or has expired');
      }

      const existing = await transaction.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
      });

      if (existing) {
        return transaction.user.update({
          where: { id: existing.id },
          data: { emailVerifiedAt: now },
          include: { marketProfile: true },
        });
      }

      return transaction.user.create({
        data: { email, emailVerifiedAt: now, provider: 'EMAIL' },
        include: { marketProfile: true },
      });
    });

    return this.buildAuthResult(user);
  }

  async completeOnboarding(userId: string): Promise<AuthResult['user']> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { onboardingCompletedAt: new Date() },
      include: { marketProfile: true },
    });
    return this.buildUser(user);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private hashCode(email: string, code: string): string {
    const secret = this.config.get<string>('JWT_SECRET')!;
    return createHmac('sha256', secret).update(`${email}:${code}`).digest('hex');
  }

  private buildAuthResult(user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    country: string | null;
    industry: string | null;
    jobTitle: string | null;
    role: string;
    onboardingCompletedAt: Date | null;
    marketProfile: AuthResult['user']['marketProfile'];
  }): AuthResult {
    const accessToken = this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
    return {
      accessToken,
      user: this.buildUser(user),
    };
  }

  private buildUser(user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    country: string | null;
    industry: string | null;
    jobTitle: string | null;
    role: string;
    onboardingCompletedAt: Date | null;
    marketProfile: AuthResult['user']['marketProfile'];
  }): AuthResult['user'] {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      country: user.country,
      industry: user.industry,
      jobTitle: user.jobTitle,
      role: user.role,
      onboardingCompletedAt: user.onboardingCompletedAt,
      marketProfile: user.marketProfile,
    };
  }
}
