import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { EngagementService } from '../engagement/engagement.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LEAD_SYNC_QUEUE } from './leads.constants';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly engagement: EngagementService,
    @InjectQueue(LEAD_SYNC_QUEUE) private readonly syncQueue: Queue,
  ) {}

  async capture(dto: CreateLeadDto) {
    const lead = await this.prisma.lead.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        company: dto.company,
        phone: dto.phone,
        country: dto.country,
        industry: dto.industry,
        role: dto.role,
        annualSpendBand: dto.annualSpendBand,
        categoriesOfInterest: dto.categoriesOfInterest ?? [],
        preferredLanguage: dto.preferredLanguage ?? 'en',
        newsletterOptIn: dto.newsletterOptIn ?? true,
        source: dto.source,
        sourceDetail: dto.sourceDetail,
        customFields: dto.customFields,
      },
    });

    if (dto.sessionId) {
      await this.engagement.linkSessionToLead(dto.sessionId, lead.id);
    }

    await this.syncQueue.add('sync-lead', { leadId: lead.id }, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } });
    this.logger.log(`Captured lead ${lead.id} from source ${lead.source}`);

    return { id: lead.id, status: lead.status };
  }
}
