import { Module } from '@nestjs/common';
import { MarketDataModule } from '../market-data/market-data.module';
import { NewsModule } from '../news/news.module';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';
import { LocalLlmProvider } from './local-llm.provider';

@Module({
  imports: [MarketDataModule, NewsModule],
  controllers: [AssistantController],
  providers: [AssistantService, LocalLlmProvider],
  exports: [LocalLlmProvider],
})
export class AssistantModule {}
