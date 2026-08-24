import { Module } from '@nestjs/common';
import { MarketDataController } from './market-data.controller';
import { MarketDataService } from './market-data.service';
import { FrankfurterProvider } from './providers/frankfurter.provider';
import { AlphaVantageProvider } from './providers/alpha-vantage.provider';
import { WorldBankProvider } from './providers/world-bank.provider';
import { FredProvider } from './providers/fred.provider';
import { ImfProvider } from './providers/imf.provider';

@Module({
  controllers: [MarketDataController],
  providers: [MarketDataService, FrankfurterProvider, AlphaVantageProvider, WorldBankProvider, FredProvider, ImfProvider],
  exports: [MarketDataService],
})
export class MarketDataModule {}
