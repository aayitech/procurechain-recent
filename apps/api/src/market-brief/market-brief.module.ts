import { Module } from '@nestjs/common';
import { MarketDataModule } from '../market-data/market-data.module';
import { NewsModule } from '../news/news.module';
import { AssistantModule } from '../assistant/assistant.module';
import { LogisticsModule } from '../logistics/logistics.module';
import { MarketBriefController } from './market-brief.controller';
import { MarketBriefService } from './market-brief.service';

@Module({
  imports: [MarketDataModule, NewsModule, AssistantModule, LogisticsModule],
  controllers: [MarketBriefController],
  providers: [MarketBriefService],
})
export class MarketBriefModule {}
