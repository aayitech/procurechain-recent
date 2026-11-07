import { Body, Controller, Post, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { GhlProfile, GhlTrackingService } from './ghl-tracking.service';
import { GhlTrackDto } from './ghl-track.dto';

const FIELD_IDS = {
  status: 'FTgvtleYsKkvBY82KDgr', band: 'RwKyBStLVzUI1R3UhMHP', area: 'sLvGFboICx6uHEIyKtYR',
  tool: '6ffkrWfUJpTBamFw11Df', utm_source: 'a2tt6FU9HK8vvWmXRYIp',
  utm_medium: 'gorXK7yRmz2a8eBkzNzL', utm_campaign: 'um8bvbd3WgRRNTKz8NIS',
} as const;

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

@Controller('ghl-track')
export class GhlTrackController {
  constructor(
    private readonly tracking: GhlTrackingService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  @Post()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async track(@Body() dto: GhlTrackDto, @Req() request: Request) {
    const bearer = request.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    let profile = this.anonymousProfile(dto);
    if (bearer) {
      try {
        const payload = await this.jwt.verifyAsync<{ sub?: string }>(bearer);
        if (payload.sub) {
          const user = await this.prisma.user.findUnique({ where: { id: payload.sub }, include: { marketProfile: true } });
          if (user) {
            profile = {
              email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone,
              company: user.company, country: user.country, city: user.marketProfile?.regionCity,
              jobTitle: user.jobTitle, industry: user.industry, currency: user.marketProfile?.currency,
              procurementCategories: user.marketProfile?.procurementCategories, commodities: user.marketProfile?.commodities,
              purchaseMix: user.marketProfile?.purchaseMix, sourcingCountries: user.marketProfile?.sourcingCountries,
              tradeLanes: user.marketProfile?.tradeLanes, procurementChallenges: user.marketProfile?.procurementChallenges,
              newsletterOptIn: user.newsletterOptIn,
            };
          }
        }
      } catch {
        // Public tracking remains available when no valid login token is present.
      }
    }
    if (!profile.email) return { ok: false };

    const fields: Array<{ id: string; field_value: string }> = [];
    const add = (id: string, value?: string) => { if (value?.trim()) fields.push({ id, field_value: value.trim() }); };
    let tags: string[];
    switch (dto.event) {
      case 'health_started':
        add(FIELD_IDS.status, 'Started'); tags = ['health_started']; break;
      case 'health_completed':
        add(FIELD_IDS.status, 'Completed'); add(FIELD_IDS.band, dto.scoreBand); add(FIELD_IDS.area, dto.identifiedArea);
        add(FIELD_IDS.tool, 'Health Check'); tags = ['buyer_health_completed']; break;
      case 'calculator_used':
        add(FIELD_IDS.tool, dto.calculator); tags = ['calculator_used']; break;
      case 'platform_registered':
        tags = ['platform_registered']; break;
    }
    for (const name of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
      const value = asString(dto.utm?.[name]);
      if (value) add(FIELD_IDS[name], value.slice(0, 200));
    }
    void this.tracking.send(profile, fields, tags);
    return { ok: true };
  }

  private anonymousProfile(dto: GhlTrackDto): GhlProfile {
    const supplied = dto.profile ?? {};
    return {
      email: dto.email ?? '',
      firstName: asString(supplied.firstName) ?? dto.firstName,
      lastName: asString(supplied.lastName),
      phone: asString(supplied.phone),
      company: asString(supplied.company) ?? dto.companyName,
      country: asString(supplied.country),
      city: asString(supplied.city),
      website: asString(supplied.website),
      jobTitle: asString(supplied.jobTitle),
      industry: asString(supplied.industry),
      currency: asString(supplied.currency),
      procurementCategories: this.asStringList(supplied.procurementCategories),
      commodities: this.asStringList(supplied.commodities),
      purchaseMix: asString(supplied.purchaseMix),
      sourcingCountries: this.asStringList(supplied.sourcingCountries),
      tradeLanes: this.asStringList(supplied.tradeLanes),
      procurementChallenges: this.asStringList(supplied.procurementChallenges),
      newsletterOptIn: typeof supplied.newsletterOptIn === 'boolean' ? supplied.newsletterOptIn : undefined,
    };
  }

  private asStringList(value: unknown): string[] | undefined {
    if (!Array.isArray(value)) return undefined;
    return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
  }
}
