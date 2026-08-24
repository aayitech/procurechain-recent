import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EngagementModule } from '../engagement/engagement.module';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { LeadsProcessor } from './leads.processor';
import { GoHighLevelClient } from './gohighlevel.client';
import { LEAD_SYNC_QUEUE } from './leads.constants';

@Module({
  imports: [BullModule.registerQueue({ name: LEAD_SYNC_QUEUE }), EngagementModule],
  controllers: [LeadsController],
  providers: [LeadsService, LeadsProcessor, GoHighLevelClient],
  exports: [LeadsService],
})
export class LeadsModule {}
