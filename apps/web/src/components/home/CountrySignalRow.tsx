'use client';

import { AlertTriangle } from 'lucide-react';
import { useFxDetail } from '@/hooks/useMarketIntelligence';
import { computeVolatility } from '@/lib/chart-stats';
import { volatilityBucket, findPortCondition, type COUNTRY_SIGNAL_DEFS } from '@/lib/country-signals';
import type { PortConditionsPayload } from '@/types/logistics';

function badgeClasses(level: 'normal' | 'elevated' | 'unavailable') {
  if (level === 'elevated') return 'bg-warning/10 text-warning';
  if (level === 'unavailable') return 'text-ink-faint';
  return 'text-positive';
}

export function CountrySignalRow({
  def,
  ports,
}: {
  def: (typeof COUNTRY_SIGNAL_DEFS)[number];
  ports: PortConditionsPayload | undefined;
}) {
  const { data: fx } = useFxDetail(def.fxQuoteCode ?? '');
  const port = findPortCondition(ports, def.portId);

  const fxVol = fx?.history && fx.history.length >= 10 ? computeVolatility(fx.history.slice(-31)) : null;
  const fxBucket = fxVol !== null ? volatilityBucket(fxVol) : null;

  const portElevated = port?.operationalFlag === 'elevated';
  const fxElevated = fxBucket === 'Elevated';
  const overall: 'normal' | 'elevated' | 'unavailable' =
    portElevated || fxElevated ? 'elevated' : fxBucket || port ? 'normal' : 'unavailable';

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border-subtle py-2 text-xs last:border-b-0">
      <span className="font-medium text-ink">{def.country}</span>
      <div className="flex items-center gap-3 text-ink-faint">
        {def.fxQuoteCode ? (
          <span>
            {def.fxQuoteCode} vol: {fxVol !== null ? `${fxVol.toFixed(2)}% (${fxBucket})` : '—'}
          </span>
        ) : (
          <span>FX not tracked</span>
        )}
        {port ? (
          <span>
            {port.name}: {port.operationalFlag === 'unavailable' ? 'no data' : port.operationalFlag}
          </span>
        ) : (
          <span>No port tracked</span>
        )}
        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${badgeClasses(overall)}`}>
          {overall === 'elevated' && <AlertTriangle size={11} />}
          {overall === 'unavailable' ? 'No data' : overall === 'elevated' ? 'Elevated' : 'Normal'}
        </span>
      </div>
    </div>
  );
}
