import { Body, Controller, Get, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
import { AssistantService } from './assistant.service';
import { AskDto } from './dto/ask.dto';

enum MarketStoryType {
  commodity = 'commodity',
  fx = 'fx',
}

@ApiTags('assistant')
@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('ask')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  ask(@Body() dto: AskDto) {
    return this.assistantService.ask(dto.question);
  }

  @Get('market-story/:type/:symbol')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  getMarketStory(
    @Param('type', new ParseEnumPipe(MarketStoryType)) type: MarketStoryType,
    @Param('symbol') symbol: string,
  ) {
    return this.assistantService.getMarketStory(type, symbol);
  }
}
