import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

const RESEND_EMAILS_ENDPOINT = 'https://api.resend.com/emails';

@Injectable()
export class AuthEmailService {
  private readonly logger = new Logger(AuthEmailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendLoginCode(email: string, code: string): Promise<boolean> {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('AUTH_EMAIL_FROM');
    const production = this.config.get<string>('NODE_ENV') === 'production';

    if (!apiKey || !from) {
      if (production) {
        throw new ServiceUnavailableException('Login email delivery is not configured');
      }
      this.logger.warn('RESEND_API_KEY or AUTH_EMAIL_FROM is missing; returning a development login code');
      return false;
    }

    const response = await fetch(RESEND_EMAILS_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': randomUUID(),
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Your ProcureChain login code',
        text: `Your ProcureChain verification code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
        html: `<div style="font-family:Arial,sans-serif;color:#111827;line-height:1.6"><h2 style="margin:0 0 16px">ProcureChain</h2><p>Use this verification code to log in:</p><p style="font-size:30px;font-weight:700;letter-spacing:8px;margin:20px 0">${code}</p><p>This code expires in 10 minutes and can be used only once.</p><p style="color:#6b7280;font-size:13px">If you did not request this code, you can ignore this email.</p></div>`,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      this.logger.error(`Resend rejected login email: ${response.status} ${details}`);
      throw new ServiceUnavailableException('Unable to send the login email right now');
    }

    return true;
  }
}
