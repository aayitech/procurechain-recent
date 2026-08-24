import { Injectable, NotFoundException } from '@nestjs/common';
import type { DimensionKey } from '../health-check/health-check.config';
import { LEARNING_PATHS } from './knowledge.config';

@Injectable()
export class KnowledgeService {
  listPaths() {
    return LEARNING_PATHS.map((p) => ({
      slug: p.slug,
      title: p.title,
      objective: p.objective,
      relatedDimension: p.relatedDimension,
      resourceCount: p.resources.length,
      comingSoon: Boolean(p.comingSoon),
    }));
  }

  getPathBySlug(slug: string) {
    const path = LEARNING_PATHS.find((p) => p.slug === slug);
    if (!path || path.comingSoon) {
      throw new NotFoundException(`Learning path "${slug}" not found`);
    }
    return path;
  }

  getRecommendedForDimension(dimension: DimensionKey) {
    return LEARNING_PATHS.filter((p) => p.relatedDimension === dimension && !p.comingSoon).map((p) => ({
      slug: p.slug,
      title: p.title,
      objective: p.objective,
    }));
  }
}
