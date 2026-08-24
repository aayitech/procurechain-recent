import { Module } from '@nestjs/common';
import { LogisticsController } from './logistics.controller';
import { LogisticsService } from './logistics.service';
import { OpenMeteoProvider } from './open-meteo.provider';

@Module({
  controllers: [LogisticsController],
  providers: [LogisticsService, OpenMeteoProvider],
  exports: [LogisticsService],
})
export class LogisticsModule {}
