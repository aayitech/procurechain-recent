import { Inject, Injectable, Logger, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type Redis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';
import { REDIS_CLIENT } from '../redis/redis.module';
import { FrankfurterProvider } from './providers/frankfurter.provider';
import { AlphaVantageProvider, TRACKED_COMMODITIES } from './providers/alpha-vantage.provider';
import { WorldBankProvider } from './providers/world-bank.provider';
import { FredProvider } from './providers/fred.provider';
import { ImfProvider } from './providers/imf.provider';
import { EiaProvider } from './providers/eia.provider';
import { computeChangeStats, toCsv, type IndicatorFrequency } from './market-data.utils';
import { DATA_SOURCE_REGISTRY, sourceUrlFor, type DataSourceRegistryEntry } from './source-registry';

const HISTORY_LOOKBACK_POINTS = 60;

export interface HistoryPoint {
  asOf: string;
  price: number;
}

const SPARKLINE_POINTS = 14;
const DERIVED_FX_PAIRS = [
  ['EUR', 'ZAR'],
  ['GBP', 'ZAR'],
  ['CNY', 'ZAR'],
  ['JPY', 'ZAR'],
  ['CAD', 'ZAR'],
  ['AUD', 'ZAR'],
  ['EUR', 'CNY'],
] as const;

export interface CommodityListEntry {
  symbol: string;
  name: string;
  unit: string;
  category: string;
  latestPrice: number;
  currency: string;
  asOf: string;
  change7d: number | null;
  change30d: number | null;
  // What change7d/change30d actually represent — "7d"/"30d" for daily
  // data, but "MoM"/"YoY" for monthly indicators or "YoY"/null for annual
  // ones. Always display this label, never assume "7d"/"30d".
  periodShortLabel: string;
  periodLongLabel: string | null;
  frequency: IndicatorFrequency;
  source: string;
  sourceUrl: string | null;
  sparkline: HistoryPoint[];
}

export interface CommodityDetail extends CommodityListEntry {
  history: HistoryPoint[];
}

export interface FxListEntry {
  baseCode: string;
  quoteCode: string;
  latestRate: number;
  asOf: string;
  change7d: number | null;
  change30d: number | null;
  periodShortLabel: string;
  periodLongLabel: string | null;
  source: string;
  sourceUrl: string | null;
  sparkline: HistoryPoint[];
}

export interface FxDetail extends FxListEntry {
  history: HistoryPoint[];
}

const DASHBOARD_CACHE_KEY = 'market-data:dashboard';
const DASHBOARD_CACHE_TTL_SECONDS = 5 * 60;

export interface DashboardPayload {
  fx: FxListEntry[];
  commodities: CommodityListEntry[];
  commodityDataAvailable: boolean;
  generatedAt: string;
}

@Injectable()
export class MarketDataService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MarketDataService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fx: FrankfurterProvider,
    private readonly commodities: AlphaVantageProvider,
    private readonly worldBank: WorldBankProvider,
    private readonly fred: FredProvider,
    private readonly imf: ImfProvider,
    private readonly eia: EiaProvider,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  onApplicationBootstrap(): void {
    // Cron jobs keep the feeds current, but a new database/deployment must not
    // remain empty until the next overnight schedule. Run this asynchronously
    // so the health endpoint can become ready while ingestion is in progress.
    setTimeout(() => {
      void this.refreshAvailableSources('startup');
    }, 5_000);
  }

  async refreshAvailableSources(reason = 'manual'): Promise<void> {
    this.logger.log(`Starting ${reason} refresh for available market-data sources`);

    const coreResults = await Promise.allSettled([
      this.refreshFx(),
      this.refreshWorldBankCommodities(),
      this.refreshFredIndicators(),
      this.refreshImfIndicators(),
      this.refreshEiaEnergy(),
    ]);

    const rejected = coreResults.filter((result) => result.status === 'rejected').length;
    if (rejected > 0) {
      this.logger.warn(`${reason} market-data refresh finished with ${rejected} rejected task(s)`);
    } else {
      this.logger.log(`${reason} market-data refresh complete`);
    }

    // Alpha Vantage's free tier needs deliberate spacing between calls, so do
    // not make the public-source refresh or application startup wait for it.
    if (this.commodities.isConfigured()) {
      void this.refreshCommodities();
    }
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async refreshFx(): Promise<void> {
    try {
      const series = await this.fx.fetchTimeSeries('USD');
      for (const point of series.points) {
        await this.prisma.currency.upsert({
          where: { code: point.quoteCode },
          update: {},
          create: { code: point.quoteCode, name: point.quoteCode },
        });
        await this.prisma.exchangeRate.upsert({
          where: {
            baseCode_quoteCode_asOf: {
              baseCode: series.baseCode,
              quoteCode: point.quoteCode,
              asOf: point.asOf,
            },
          },
          update: { rate: point.rate },
          create: {
            baseCode: series.baseCode,
            quoteCode: point.quoteCode,
            rate: point.rate,
            asOf: point.asOf,
            source: series.source,
          },
        });
      }

      const ratesByDate = new Map<number, Map<string, number>>();
      for (const point of series.points) {
        const timestamp = point.asOf.getTime();
        const rates = ratesByDate.get(timestamp) ?? new Map<string, number>();
        rates.set(point.quoteCode, point.rate);
        ratesByDate.set(timestamp, rates);
      }

      let derivedPointCount = 0;
      for (const [timestamp, rates] of ratesByDate) {
        for (const [baseCode, quoteCode] of DERIVED_FX_PAIRS) {
          const basePerUsd = rates.get(baseCode);
          const quotePerUsd = rates.get(quoteCode);
          if (!basePerUsd || !quotePerUsd) continue;

          await this.prisma.currency.upsert({
            where: { code: quoteCode },
            update: {},
            create: { code: quoteCode, name: quoteCode },
          });
          await this.prisma.exchangeRate.upsert({
            where: {
              baseCode_quoteCode_asOf: { baseCode, quoteCode, asOf: new Date(timestamp) },
            },
            update: { rate: quotePerUsd / basePerUsd, source: series.source },
            create: {
              baseCode,
              quoteCode,
              rate: quotePerUsd / basePerUsd,
              asOf: new Date(timestamp),
              source: series.source,
            },
          });
          derivedPointCount += 1;
        }
      }
      await this.redis.del(DASHBOARD_CACHE_KEY);
      this.logger.log(`Refreshed ${series.points.length} direct and ${derivedPointCount} cross-rate FX points`);
    } catch (error) {
      this.logger.error('FX refresh failed', error as Error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async refreshCommodities(): Promise<void> {
    if (!this.commodities.isConfigured()) {
      this.logger.warn('Skipping commodity refresh: ALPHA_VANTAGE_API_KEY not set');
      return;
    }

    for (const commodity of TRACKED_COMMODITIES) {
      try {
        const series = await this.commodities.fetchPriceSeries(commodity);
        if (!series) continue;

        const record = await this.prisma.commodity.upsert({
          where: { symbol: series.symbol },
          update: { name: series.name, unit: series.unit, category: series.category, frequency: 'monthly' },
          create: {
            symbol: series.symbol,
            name: series.name,
            unit: series.unit,
            category: series.category,
            frequency: 'monthly',
          },
        });

        for (const point of series.points) {
          await this.prisma.commodityPrice.upsert({
            where: { commodityId_asOf: { commodityId: record.id, asOf: point.asOf } },
            update: { price: point.price, source: series.source },
            create: {
              commodityId: record.id,
              price: point.price,
              asOf: point.asOf,
              source: series.source,
            },
          });
        }
      } catch (error) {
        this.logger.error(`Commodity refresh failed for ${commodity.symbol}`, error as Error);
      }
      // Stay comfortably under Alpha Vantage's free-tier rate limit.
      await new Promise((resolve) => setTimeout(resolve, 13_000));
    }

    await this.redis.del(DASHBOARD_CACHE_KEY);
    this.logger.log('Commodity refresh cycle complete');
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async refreshWorldBankCommodities(): Promise<void> {
    try {
      const seriesList = await this.worldBank.fetchAllSeries();
      for (const series of seriesList) {
        const eiaDailySeries = this.eia.isConfigured() && (series.symbol === 'BRENT' || series.symbol === 'WTI');
        const record = await this.prisma.commodity.upsert({
          where: { symbol: series.symbol },
          update: {
            name: series.name,
            unit: series.unit,
            category: series.category,
            ...(eiaDailySeries ? {} : { frequency: 'monthly' }),
          },
          create: {
            symbol: series.symbol,
            name: series.name,
            unit: series.unit,
            category: series.category,
            frequency: 'monthly',
          },
        });

        for (const point of series.points) {
          await this.prisma.commodityPrice.upsert({
            where: { commodityId_asOf: { commodityId: record.id, asOf: point.asOf } },
            update: { price: point.price, source: series.source },
            create: {
              commodityId: record.id,
              price: point.price,
              asOf: point.asOf,
              source: series.source,
            },
          });
        }
      }

      await this.redis.del(DASHBOARD_CACHE_KEY);
      this.logger.log(`World Bank refresh complete: ${seriesList.length} commodities`);
    } catch (error) {
      this.logger.error('World Bank refresh failed', error as Error);
    }
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async refreshEiaEnergy(): Promise<void> {
    if (!this.eia.isConfigured()) {
      this.logger.warn('Skipping EIA refresh: EIA_API_KEY not set');
      return;
    }

    try {
      const seriesList = await this.eia.fetchAllSeries();
      for (const series of seriesList) {
        const record = await this.prisma.commodity.upsert({
          where: { symbol: series.symbol },
          update: { name: series.name, unit: series.unit, category: series.category, frequency: 'daily' },
          create: {
            symbol: series.symbol,
            name: series.name,
            unit: series.unit,
            category: series.category,
            frequency: 'daily',
          },
        });

        for (const point of series.points) {
          await this.prisma.commodityPrice.upsert({
            where: { commodityId_asOf: { commodityId: record.id, asOf: point.asOf } },
            update: { price: point.price, source: series.source },
            create: {
              commodityId: record.id,
              price: point.price,
              asOf: point.asOf,
              source: series.source,
            },
          });
        }
      }

      await this.redis.del(DASHBOARD_CACHE_KEY);
      this.logger.log(`EIA refresh complete: ${seriesList.length} energy series`);
    } catch (error) {
      this.logger.error('EIA refresh failed', error as Error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async refreshFredIndicators(): Promise<void> {
    if (!this.fred.isConfigured()) {
      this.logger.warn('Skipping FRED refresh: FRED_API_KEY not set');
      return;
    }

    try {
      const seriesList = await this.fred.fetchAllSeries();
      for (const series of seriesList) {
        const record = await this.prisma.commodity.upsert({
          where: { symbol: series.symbol },
          update: { name: series.name, unit: series.unit, category: series.category, frequency: 'monthly' },
          create: {
            symbol: series.symbol,
            name: series.name,
            unit: series.unit,
            category: series.category,
            frequency: 'monthly',
          },
        });

        for (const point of series.points) {
          await this.prisma.commodityPrice.upsert({
            where: { commodityId_asOf: { commodityId: record.id, asOf: point.asOf } },
            update: { price: point.price, source: series.source },
            create: {
              commodityId: record.id,
              price: point.price,
              asOf: point.asOf,
              source: series.source,
            },
          });
        }
      }

      await this.redis.del(DASHBOARD_CACHE_KEY);
      this.logger.log(`FRED refresh complete: ${seriesList.length} indicators`);
    } catch (error) {
      this.logger.error('FRED refresh failed', error as Error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async refreshImfIndicators(): Promise<void> {
    try {
      const seriesList = await this.imf.fetchAllSeries();
      for (const series of seriesList) {
        const record = await this.prisma.commodity.upsert({
          where: { symbol: series.symbol },
          update: { name: series.name, unit: series.unit, category: series.category, frequency: 'annual' },
          create: {
            symbol: series.symbol,
            name: series.name,
            unit: series.unit,
            category: series.category,
            frequency: 'annual',
          },
        });

        for (const point of series.points) {
          await this.prisma.commodityPrice.upsert({
            where: { commodityId_asOf: { commodityId: record.id, asOf: point.asOf } },
            update: { price: point.price, source: series.source },
            create: {
              commodityId: record.id,
              price: point.price,
              asOf: point.asOf,
              source: series.source,
            },
          });
        }
      }

      await this.redis.del(DASHBOARD_CACHE_KEY);
      this.logger.log(`IMF refresh complete: ${seriesList.length} indicators`);
    } catch (error) {
      this.logger.error('IMF refresh failed', error as Error);
    }
  }

  async getDashboard(): Promise<DashboardPayload> {
    const cached = await this.redis.get(DASHBOARD_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as DashboardPayload;
    }

    const [fx, commodities] = await Promise.all([this.listFx(), this.listCommodities()]);

    const payload: DashboardPayload = {
      fx,
      commodities,
      commodityDataAvailable: commodities.length > 0,
      generatedAt: new Date().toISOString(),
    };

    await this.redis.set(DASHBOARD_CACHE_KEY, JSON.stringify(payload), 'EX', DASHBOARD_CACHE_TTL_SECONDS);
    return payload;
  }

  listSources(): DataSourceRegistryEntry[] {
    return DATA_SOURCE_REGISTRY.map((source) => {
      if (source.sourceId === 'fred') {
        return { ...source, status: this.fred.isConfigured() ? 'active' : 'configuration_required' };
      }
      if (source.sourceId === 'alpha-vantage') {
        return { ...source, status: this.commodities.isConfigured() ? 'active' : 'configuration_required' };
      }
      if (source.sourceId === 'eia') {
        return { ...source, status: this.eia.isConfigured() ? 'active' : 'configuration_required' };
      }
      return source;
    });
  }

  async listCommodities(): Promise<CommodityListEntry[]> {
    const commodities = await this.prisma.commodity.findMany();
    const results: CommodityListEntry[] = [];

    for (const commodity of commodities) {
      const rows = await this.prisma.commodityPrice.findMany({
        where: { commodityId: commodity.id },
        orderBy: { asOf: 'desc' },
        take: HISTORY_LOOKBACK_POINTS,
      });
      if (rows.length === 0) continue;

      const ascending = [...rows].reverse();
      const latest = ascending[ascending.length - 1];
      const frequency = (commodity.frequency as IndicatorFrequency) ?? 'daily';
      const stats = computeChangeStats(ascending, frequency);

      results.push({
        symbol: commodity.symbol,
        name: commodity.name,
        unit: commodity.unit,
        category: commodity.category,
        latestPrice: latest.price,
        currency: latest.currency,
        asOf: latest.asOf.toISOString(),
        change7d: stats.change7d,
        change30d: stats.change30d,
        periodShortLabel: stats.periodShortLabel,
        periodLongLabel: stats.periodLongLabel,
        frequency,
        source: latest.source,
        sourceUrl: sourceUrlFor(latest.source),
        sparkline: ascending
          .slice(-SPARKLINE_POINTS)
          .map((row) => ({ asOf: row.asOf.toISOString(), price: row.price })),
      });
    }

    return results;
  }

  async getCommodityDetail(symbol: string): Promise<CommodityDetail> {
    const commodity = await this.prisma.commodity.findUnique({ where: { symbol } });
    if (!commodity) {
      throw new NotFoundException(`Unknown commodity symbol: ${symbol}`);
    }

    const rows = await this.prisma.commodityPrice.findMany({
      where: { commodityId: commodity.id },
      orderBy: { asOf: 'desc' },
      take: HISTORY_LOOKBACK_POINTS,
    });
    if (rows.length === 0) {
      throw new NotFoundException(`No price history yet for ${symbol}`);
    }

    const ascending = [...rows].reverse();
    const latest = ascending[ascending.length - 1];
    const frequency = (commodity.frequency as IndicatorFrequency) ?? 'daily';
    const stats = computeChangeStats(ascending, frequency);

    return {
      symbol: commodity.symbol,
      name: commodity.name,
      unit: commodity.unit,
      category: commodity.category,
      latestPrice: latest.price,
      currency: latest.currency,
      asOf: latest.asOf.toISOString(),
      change7d: stats.change7d,
      change30d: stats.change30d,
      periodShortLabel: stats.periodShortLabel,
      periodLongLabel: stats.periodLongLabel,
      frequency,
      source: latest.source,
      sourceUrl: sourceUrlFor(latest.source),
      sparkline: ascending
        .slice(-SPARKLINE_POINTS)
        .map((row) => ({ asOf: row.asOf.toISOString(), price: row.price })),
      history: ascending.map((row) => ({ asOf: row.asOf.toISOString(), price: row.price })),
    };
  }

  async getCommodityCsv(symbol: string): Promise<string> {
    const detail = await this.getCommodityDetail(symbol);
    return toCsv(
      detail.history.map((point) => ({
        date: point.asOf.slice(0, 10),
        price: point.price,
        unit: detail.unit,
      })),
    );
  }

  async listFx(): Promise<FxListEntry[]> {
    const pairs = await this.prisma.exchangeRate.findMany({
      distinct: ['baseCode', 'quoteCode'],
      select: { baseCode: true, quoteCode: true },
    });
    const results: FxListEntry[] = [];

    for (const pair of pairs) {
      const rows = await this.prisma.exchangeRate.findMany({
        where: { baseCode: pair.baseCode, quoteCode: pair.quoteCode },
        orderBy: { asOf: 'desc' },
        take: HISTORY_LOOKBACK_POINTS,
      });
      if (rows.length === 0) continue;

      const ascending = [...rows].reverse();
      const latest = ascending[ascending.length - 1];
      const stats = computeChangeStats(ascending.map((r) => ({ asOf: r.asOf, price: r.rate })));

      results.push({
        baseCode: latest.baseCode,
        quoteCode: latest.quoteCode,
        latestRate: latest.rate,
        asOf: latest.asOf.toISOString(),
        change7d: stats.change7d,
        change30d: stats.change30d,
        periodShortLabel: stats.periodShortLabel,
        periodLongLabel: stats.periodLongLabel,
        source: latest.source,
        sourceUrl: sourceUrlFor(latest.source),
        sparkline: ascending
          .slice(-SPARKLINE_POINTS)
          .map((row) => ({ asOf: row.asOf.toISOString(), price: row.rate })),
      });
    }

    return results;
  }

  async getFxDetail(pairOrQuoteCode: string): Promise<FxDetail> {
    const requested = pairOrQuoteCode.toUpperCase();
    const [baseCode, quoteCode] = requested.includes('-') ? requested.split('-', 2) : ['USD', requested];
    const rows = await this.prisma.exchangeRate.findMany({
      where: { baseCode, quoteCode },
      orderBy: { asOf: 'desc' },
      take: HISTORY_LOOKBACK_POINTS,
    });
    if (rows.length === 0) {
      throw new NotFoundException(`No FX history yet for ${baseCode}/${quoteCode}`);
    }

    const ascending = [...rows].reverse();
    const latest = ascending[ascending.length - 1];
    const stats = computeChangeStats(ascending.map((r) => ({ asOf: r.asOf, price: r.rate })));

    return {
      baseCode: latest.baseCode,
      quoteCode: latest.quoteCode,
      latestRate: latest.rate,
      asOf: latest.asOf.toISOString(),
      change7d: stats.change7d,
      change30d: stats.change30d,
      periodShortLabel: stats.periodShortLabel,
      periodLongLabel: stats.periodLongLabel,
      source: latest.source,
      sourceUrl: sourceUrlFor(latest.source),
      sparkline: ascending
        .slice(-SPARKLINE_POINTS)
        .map((row) => ({ asOf: row.asOf.toISOString(), price: row.rate })),
      history: ascending.map((row) => ({ asOf: row.asOf.toISOString(), price: row.rate })),
    };
  }

  async getFxCsv(quoteCode: string): Promise<string> {
    const detail = await this.getFxDetail(quoteCode);
    return toCsv(
      detail.history.map((point) => ({
        date: point.asOf.slice(0, 10),
        rate: point.price,
        pair: `${detail.baseCode}/${detail.quoteCode}`,
      })),
    );
  }
}
