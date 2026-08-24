import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { GoHighLevelClient } from './gohighlevel.client';
import { LEAD_SYNC_QUEUE } from './leads.constants';

interface SyncLeadJobData {
  leadId: string;
}

@Processor(LEAD_SYNC_QUEUE)
export class LeadsProcessor extends WorkerHost {
  private readonly logger = new Logger(LeadsProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ghl: GoHighLevelClient,
  ) {
    super();
  }

  async process(job: Job<SyncLeadJobData>): Promise<void> {
    const lead = await this.prisma.lead.findUnique({ where: { id: job.data.leadId } });
    if (!lead) {
      this.logger.warn(`Lead ${job.data.leadId} not found, skipping sync`);
      return;
    }

    const result = await this.ghl.upsertContact(lead);

    if (result.synced) {
      await this.prisma.lead.update({
        where: { id: lead.id },
        data: { status: 'SYNCED', syncedAt: new Date(), syncError: null },
      });
    } else {
      await this.prisma.lead.update({
        where: { id: lead.id },
        data: { status: 'SYNC_FAILED', syncError: result.reason },
      });
      this.logger.log(`Lead ${lead.id} not synced to GoHighLevel: ${result.reason}`);
    }
  }
}
