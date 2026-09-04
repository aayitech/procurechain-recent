import { Controller, ForbiddenException, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { MarketDataService } from './market-data.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@ApiTags('market-data')
@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketData: MarketDataService) {}

  @Get('dashboard')
  getDashboard() {
    return this.marketData.getDashboard();
  }

  @Get('commodities')
  listCommodities() {
    return this.marketData.listCommodities();
  }

  @Get('commodities/:symbol')
  getCommodity(@Param('symbol') symbol: string) {
    return this.marketData.getCommodityDetail(symbol.toUpperCase());
  }

  @Get('commodities/:symbol/export.csv')
  async exportCommodityCsv(@Param('symbol') symbol: string, @Res({ passthrough: true }) res: Response) {
    const csv = await this.marketData.getCommodityCsv(symbol.toUpperCase());
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${symbol.toUpperCase()}-price-history.csv"`);
    return csv;
  }

  @Get('fx')
  listFx() {
    return this.marketData.listFx();
  }

  @Get('fx/:code')
  getFx(@Param('code') code: string) {
    return this.marketData.getFxDetail(code);
  }

  @Get('fx/:code/export.csv')
  async exportFxCsv(@Param('code') code: string, @Res({ passthrough: true }) res: Response) {
    const csv = await this.marketData.getFxCsv(code);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="USD-${code.toUpperCase()}-history.csv"`);
    return csv;
  }

  @Post('refresh')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req: Request) {
    const user = req.user as JwtPayload;
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can trigger a manual market data refresh');
    }
    await Promise.all([
      this.marketData.refreshFx(),
      this.marketData.refreshCommodities(),
      this.marketData.refreshWorldBankCommodities(),
      this.marketData.refreshFredIndicators(),
      this.marketData.refreshImfIndicators(),
    ]);
    return this.marketData.getDashboard();
  }
}
