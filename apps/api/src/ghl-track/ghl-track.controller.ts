import { Body, Controller, HttpException, HttpStatus, Logger, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { GhlTrackDto } from './ghl-track.dto';

const FIELD_IDS = {
  status: 'FTgvtleYsKkvBY82KDgr',
  band: 'RwKyBStLVzUI1R3UhMHP',
  area: 'sLvGFboICx6uHEIyKtYR',
  tool: '6ffkrWfUJpTBamFw11Df',
  utm_source: 'a2tt6FU9HK8vvWmXRYIp',
  utm_medium: 'gorXK7yRmz2a8eBkzNzL',
  utm_campaign: 'um8bvbd3WgRRNTKz8NIS',
} as const;

@Controller('ghl-track')
export class GhlTrackController {
  private readonly logger = new Logger(GhlTrackController.name);

  constructor(private readonly config: ConfigService) {}

  @Post()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async track(@Body() dto: GhlTrackDto) {
    const token = this.config.get<string>('GHL_TOKEN');
    const locationId = this.config.get<string>('GHL_LOCATION_ID');
    if (!token || !locationId) throw new HttpException('GHL tracking is not configured', HttpStatus.SERVICE_UNAVAILABLE);

    const customFields: Array<{ id: string; field_value: string }> = [];
    const addField = (id: string, value?: string) => { if (value) customFields.push({ id, field_value: value }); };
    let tags: string[];
    if (dto.event === 'health_started') {
      addField(FIELD_IDS.status, 'Started');
      tags = ['health_started'];
    } else if (dto.event === 'health_completed') {
      addField(FIELD_IDS.status, 'Completed');
      addField(FIELD_IDS.band, dto.scoreBand);
      addField(FIELD_IDS.area, dto.identifiedArea);
      addField(FIELD_IDS.tool, 'Health Check');
      tags = ['buyer_health_completed'];
    } else {
      addField(FIELD_IDS.tool, dto.calculator);
      tags = ['calculator_used'];
    }
    for (const name of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
      const value = dto.utm?.[name];
      if (typeof value === 'string') addField(FIELD_IDS[name], value.slice(0, 200));
    }

    const headers = { Authorization: `Bearer ${token}`, Version: '2021-07-28', 'Content-Type': 'application/json' };
    try {
      const upsertResponse = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
        method: 'POST', headers,
        body: JSON.stringify({ locationId, email: dto.email, ...(dto.firstName ? { firstName: dto.firstName } : {}), ...(dto.companyName ? { companyName: dto.companyName } : {}), customFields }),
      });
      if (!upsertResponse.ok) throw new Error(`Contact upsert returned ${upsertResponse.status}`);
      const upsert = await upsertResponse.json() as { contact?: { id?: string }; id?: string };
      const contactId = upsert.contact?.id ?? upsert.id;
      if (!contactId) throw new Error('Contact upsert response did not contain a contact id');

      const tagResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${encodeURIComponent(contactId)}/tags`, {
        method: 'POST', headers, body: JSON.stringify({ tags }),
      });
      if (!tagResponse.ok) throw new Error(`Contact tagging returned ${tagResponse.status}`);
      return { ok: true };
    } catch (error) {
      this.logger.error('GHL tracking failed', error instanceof Error ? error.stack : String(error));
      throw new HttpException('GHL tracking failed', HttpStatus.BAD_GATEWAY);
    }
  }
}
