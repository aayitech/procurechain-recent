import { Module } from '@nestjs/common';
import { MarketDataModule } from '../market-data/market-data.module';
import { NewsModule } from '../news/news.module';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';
import { GeminiProvider } from './gemini.provider';

@Module({
  imports: [MarketDataModule, NewsModule],
  controllers: [AssistantController],
  providers: [AssistantService, GeminiProvider],
  exports: [GeminiProvider],
})
export class AssistantModule {}
