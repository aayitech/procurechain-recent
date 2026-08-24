import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MarketIntelligenceService } from './market-intelligence.service';

@ApiTags('market-intelligence')
@Controller('market-intelligence')
export class MarketIntelligenceController {
  constructor(private readonly marketIntelligenceService: MarketIntelligenceService) {}

  @Get('snapshot')
  getSnapshot() {
    return this.marketIntelligenceService.getSnapshot();
  }
}
