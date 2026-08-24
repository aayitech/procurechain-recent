import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KnowledgeService } from './knowledge.service';
import type { DimensionKey } from '../health-check/health-check.config';

@ApiTags('knowledge')
@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get('paths')
  listPaths() {
    return this.knowledgeService.listPaths();
  }

  @Get('paths/:slug')
  getPath(@Param('slug') slug: string) {
    return this.knowledgeService.getPathBySlug(slug);
  }

  @Get('recommended/:dimension')
  getRecommended(@Param('dimension') dimension: string) {
    return this.knowledgeService.getRecommendedForDimension(dimension as DimensionKey);
  }
}
