import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';
import { OpenMeteoProvider, type PortCondition } from './open-meteo.provider';

const CACHE_KEY = 'logistics:port-conditions';
const CACHE_TTL_SECONDS = 45 * 60;

export interface PortConditionsPayload {
  generatedAt: string;
  points: PortCondition[];
}

@Injectable()
export class LogisticsService {
  private readonly logger = new Logger(LogisticsService.name);

  constructor(
    private readonly openMeteo: OpenMeteoProvider,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async getPortConditions(): Promise<PortConditionsPayload> {
    const cached = await this.redis.get(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as PortConditionsPayload;
    }
    return this.refresh();
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async refresh(): Promise<PortConditionsPayload> {
    const points = await this.openMeteo.fetchAll();
    const payload: PortConditionsPayload = { generatedAt: new Date().toISOString(), points };
    await this.redis.set(CACHE_KEY, JSON.stringify(payload), 'EX', CACHE_TTL_SECONDS);
    this.logger.log(`Refreshed port conditions for ${points.length} trade route points`);
    return payload;
  }
}
