import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validate } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import { MarketDataModule } from './market-data/market-data.module';
import { NewsModule } from './news/news.module';
import { AssistantModule } from './assistant/assistant.module';
import { LogisticsModule } from './logistics/logistics.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { MarketBriefModule } from './market-brief/market-brief.module';
import { EngagementModule } from './engagement/engagement.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { MarketIntelligenceModule } from './market-intelligence/market-intelligence.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        connection: { url: process.env.REDIS_URL },
      }),
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    LeadsModule,
    MarketDataModule,
    NewsModule,
    AssistantModule,
    LogisticsModule,
    HealthCheckModule,
    MarketBriefModule,
    EngagementModule,
    KnowledgeModule,
    MarketIntelligenceModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
