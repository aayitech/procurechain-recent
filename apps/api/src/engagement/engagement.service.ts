import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ENGAGEMENT_EVENT_POINTS, categorizeEngagementScore } from './engagement.config';
import type { TrackEventDto } from './dto/track-event.dto';

export interface EngagementScoreResult {
  score: number;
  category: { key: string; label: string };
}

@Injectable()
export class EngagementService {
  constructor(private readonly prisma: PrismaService) {}

  async track(dto: TrackEventDto): Promise<EngagementScoreResult> {
    const points = ENGAGEMENT_EVENT_POINTS[dto.eventType];
    await this.prisma.engagementEvent.create({
      data: { sessionId: dto.sessionId, leadId: dto.leadId, eventType: dto.eventType, points },
    });
    return this.getScoreForSession(dto.sessionId);
  }

  async getScoreForSession(sessionId: string): Promise<EngagementScoreResult> {
    const events = await this.prisma.engagementEvent.findMany({ where: { sessionId } });
    return this.summarize(events.map((e) => e.points));
  }

  async getScoreForLead(leadId: string): Promise<EngagementScoreResult> {
    const events = await this.prisma.engagementEvent.findMany({ where: { leadId } });
    return this.summarize(events.map((e) => e.points));
  }

  /** Attaches this session's prior (anonymous) events to a now-known lead, so engagement history carries over once someone identifies themselves. */
  async linkSessionToLead(sessionId: string, leadId: string): Promise<void> {
    await this.prisma.engagementEvent.updateMany({
      where: { sessionId, leadId: null },
      data: { leadId },
    });
  }

  private summarize(points: number[]): EngagementScoreResult {
    const score = points.reduce((sum, p) => sum + p, 0);
    const category = categorizeEngagementScore(score);
    return { score, category: { key: category.key, label: category.label } };
  }
}
