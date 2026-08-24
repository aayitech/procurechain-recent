import { Module } from '@nestjs/common';
import { LeadsModule } from '../leads/leads.module';
import { EngagementModule } from '../engagement/engagement.module';
import { HealthCheckController } from './health-check.controller';
import { HealthCheckService } from './health-check.service';

@Module({
  imports: [LeadsModule, EngagementModule],
  controllers: [HealthCheckController],
  providers: [HealthCheckService],
})
export class HealthCheckModule {}
