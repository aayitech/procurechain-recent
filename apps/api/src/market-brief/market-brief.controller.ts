import { Controller, ForbiddenException, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { MarketBriefService } from './market-brief.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@ApiTags('market-brief')
@Controller('market-brief')
export class MarketBriefController {
  constructor(private readonly marketBriefService: MarketBriefService) {}

  @Get()
  list() {
    return this.marketBriefService.list();
  }

  @Get('drafts')
  @UseGuards(JwtAuthGuard)
  async listDrafts(@Req() req: Request) {
    this.requireAdmin(req);
    return this.marketBriefService.listDrafts();
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const brief = await this.marketBriefService.getBySlug(slug);
    if (!brief) throw new NotFoundException('Market brief not found');
    return brief;
  }

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generate(@Req() req: Request) {
    this.requireAdmin(req);
    return this.marketBriefService.generateDraft();
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  async publish(@Req() req: Request, @Param('id') id: string) {
    this.requireAdmin(req);
    return this.marketBriefService.publish(id);
  }

  private requireAdmin(req: Request) {
    const user = req.user as JwtPayload;
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can manage market briefs');
    }
  }
}
