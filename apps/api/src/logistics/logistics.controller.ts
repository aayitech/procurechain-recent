import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogisticsService } from './logistics.service';

@ApiTags('logistics')
@Controller('logistics')
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Get('port-conditions')
  getPortConditions() {
    return this.logisticsService.getPortConditions();
  }
}
