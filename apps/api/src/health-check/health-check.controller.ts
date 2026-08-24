import { Body, Controller, Get, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheckService } from './health-check.service';
import { ScoreHealthCheckDto } from './dto/score-health-check.dto';
import { SubmitHealthCheckDto } from './dto/submit-health-check.dto';

@ApiTags('health-check')
@Controller('health-check')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get('questions')
  getQuestions() {
    return this.healthCheckService.getQuestions();
  }

  @Post('score')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  score(@Body() dto: ScoreHealthCheckDto) {
    return this.healthCheckService.computeScore(dto.answers);
  }

  @Post('submit')
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  submit(@Body() dto: SubmitHealthCheckDto) {
    return this.healthCheckService.submit(dto);
  }
}
