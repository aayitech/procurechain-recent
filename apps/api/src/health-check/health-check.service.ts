import { BadRequestException, Injectable } from '@nestjs/common';
import { LeadSource } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LeadsService } from '../leads/leads.service';
import { EngagementService } from '../engagement/engagement.service';
import {
  DIMENSIONS,
  DIMENSION_KEYS,
  DIMENSION_RECOMMENDATIONS,
  HEALTH_CHECK_ASSESSMENT_VERSION,
  HEALTH_CHECK_QUESTIONS,
  MATURITY_LEVELS,
  type DimensionKey,
} from './health-check.config';
import { isValidAnswerKey } from './dto/score-health-check.dto';
import { SubmitHealthCheckDto } from './dto/submit-health-check.dto';

export interface DimensionResult {
  key: DimensionKey;
  label: string;
  score: number;
  opportunity: number;
}

export interface HealthCheckScoreResult {
  overallScore: number;
  maturity: { key: string; label: string; description: string };
  dimensions: DimensionResult[];
  topOpportunities: Array<{
    key: DimensionKey;
    label: string;
    score: number;
    opportunityLabel: string;
    actions: string[];
    links: Array<{ label: string; href: string }>;
  }>;
}

@Injectable()
export class HealthCheckService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly leadsService: LeadsService,
    private readonly engagementService: EngagementService,
  ) {}

  getQuestions() {
    return HEALTH_CHECK_QUESTIONS.map((q) => ({
      id: q.id,
      text: q.text,
      answers: q.answers.map((a) => ({ key: a.key, label: a.label })),
    }));
  }

  /** Weighted normalization per dimension — never a simple average. */
  computeScore(answers: Record<string, string>): HealthCheckScoreResult {
    for (const question of HEALTH_CHECK_QUESTIONS) {
      const given = answers[question.id];
      if (!isValidAnswerKey(given)) {
        throw new BadRequestException(`Missing or invalid answer for ${question.id}`);
      }
    }

    const weightedSum: Record<DimensionKey, number> = this.zeroed();
    const weightTotal: Record<DimensionKey, number> = this.zeroed();

    for (const question of HEALTH_CHECK_QUESTIONS) {
      const answerKey = answers[question.id];
      const option = question.answers.find((a) => a.key === answerKey)!;

      for (const [dimension, weight] of Object.entries(question.dimensionWeights) as Array<[DimensionKey, number]>) {
        weightedSum[dimension] += option.score * weight;
        weightTotal[dimension] += weight;
      }
    }

    const dimensions: DimensionResult[] = DIMENSION_KEYS.map((key) => {
      const score = weightTotal[key] > 0 ? weightedSum[key] / weightTotal[key] : 0;
      const roundedScore = Math.round(score * 10) / 10;
      const opportunity = Math.max(0, Math.round((100 - score) * 10) / 10);
      return { key, label: DIMENSIONS[key].label, score: roundedScore, opportunity };
    });

    const overallScore = Math.round(
      dimensions.reduce((sum, d) => sum + d.score * DIMENSIONS[d.key].overallWeight, 0) * 10,
    ) / 10;

    const maturity = MATURITY_LEVELS.find((level) => overallScore >= level.min && overallScore <= level.max) ?? MATURITY_LEVELS[0];

    const topOpportunities = [...dimensions]
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((d) => ({
        key: d.key,
        label: d.label,
        score: d.score,
        ...DIMENSION_RECOMMENDATIONS[d.key],
      }));

    return {
      overallScore,
      maturity: { key: maturity.key, label: maturity.label, description: maturity.description },
      dimensions,
      topOpportunities,
    };
  }

  async submit(dto: SubmitHealthCheckDto) {
    const result = this.computeScore(dto.answers);

    // Real GHL custom-field payload per the business spec: overall +
    // per-dimension scores, maturity, top 3 gaps, assessment metadata.
    const customFields: Record<string, string | number> = {
      procurement_performance_score: result.overallScore,
      maturity_level: result.maturity.label,
      assessment_completed: 'true',
      assessment_date: new Date().toISOString().slice(0, 10),
      assessment_version: HEALTH_CHECK_ASSESSMENT_VERSION,
    };
    for (const d of result.dimensions) {
      customFields[DIMENSIONS[d.key].ghlField] = d.score;
    }
    const [primaryGap, secondaryGap, thirdGap] = result.topOpportunities;
    if (primaryGap) customFields.primary_gap = primaryGap.label;
    if (secondaryGap) customFields.secondary_gap = secondaryGap.label;
    if (thirdGap) customFields.third_gap = thirdGap.label;

    if (dto.sessionId) {
      const engagement = await this.engagementService.getScoreForSession(dto.sessionId);
      customFields.engagement_score = engagement.score;
      customFields.engagement_category = engagement.category.label;
    }

    const lead = await this.leadsService.capture({
      firstName: dto.lead.firstName,
      lastName: dto.lead.lastName,
      email: dto.lead.email,
      company: dto.lead.company,
      country: dto.lead.country,
      industry: dto.lead.industry,
      role: dto.lead.jobTitle,
      source: LeadSource.ASSESSMENT,
      sourceDetail: 'procurement-health-check',
      newsletterOptIn: true,
      customFields,
    });

    if (dto.sessionId) {
      await this.engagementService.linkSessionToLead(dto.sessionId, lead.id);
    }

    const dimensionScores = Object.fromEntries(result.dimensions.map((d) => [d.key, d.score]));

    await this.prisma.healthCheckSubmission.create({
      data: {
        answers: dto.answers,
        dimensionScores,
        overallScore: result.overallScore,
        maturityLevel: result.maturity.key,
        leadId: lead.id,
      },
    });

    return result;
  }

  private zeroed(): Record<DimensionKey, number> {
    return Object.fromEntries(DIMENSION_KEYS.map((k) => [k, 0])) as Record<DimensionKey, number>;
  }
}
