import { Module } from '@nestjs/common';
import { MarketDataModule } from '../market-data/market-data.module';
import { NewsModule } from '../news/news.module';
import { LogisticsModule } from '../logistics/logistics.module';
import { MarketIntelligenceController } from './market-intelligence.controller';
import { MarketIntelligenceService } from './market-intelligence.service';

@Module({
  imports: [MarketDataModule, NewsModule, LogisticsModule],
  controllers: [MarketIntelligenceController],
  providers: [MarketIntelligenceService],
})
export class MarketIntelligenceModule {}
