import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
import { EngagementService } from './engagement.service';
import { TrackEventDto } from './dto/track-event.dto';

@ApiTags('engagement')
@Controller('engagement')
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  @Post('track')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  track(@Body() dto: TrackEventDto) {
    return this.engagementService.track(dto);
  }

  @Get('session/:sessionId')
  getForSession(@Param('sessionId') sessionId: string) {
    return this.engagementService.getScoreForSession(sessionId);
  }
}
