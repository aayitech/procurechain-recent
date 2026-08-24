'use client';

import { AlertTriangle, Anchor, CloudRain, Ship, Wind } from 'lucide-react';
import { usePortConditions } from '@/hooks/useLogistics';
import type { PortCondition } from '@/types/logistics';

function formatTime(iso: string | null) {
  if (!iso) return 'unavailable';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
}

function KindIcon({ kind }: { kind: string }) {
  if (kind === 'canal' || kind === 'strait') return <Ship size={14} className="text-ink-faint" />;
  return <Anchor size={14} className="text-ink-faint" />;
}

function ConditionCard({ point }: { point: PortCondition }) {
  const elevated = point.operationalFlag === 'elevated';
  const unavailable = point.operationalFlag === 'unavailable';

  return (
    <div className="card flex flex-col gap-2 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <KindIcon kind={point.kind} />
          <div>
            <p className="text-sm font-medium text-ink">{point.name}</p>
            <p className="text-[11px] text-ink-faint">{point.region}</p>
          </div>
        </div>
        {elevated && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
            <AlertTriangle size={11} /> Elevated
          </span>
        )}
      </div>

      {unavailable ? (
        <p className="text-xs text-ink-faint">Live weather data unavailable right now.</p>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span>{point.weatherDescription}</span>
            <span className="font-mono text-ink">{point.temperatureC?.toFixed(0)}°C</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-ink-faint">
            <span className="flex items-center gap-1">
              <Wind size={12} /> {point.windSpeedKmh?.toFixed(0)} km/h wind
              {point.windGustsKmh !== null && point.windGustsKmh > (point.windSpeedKmh ?? 0) && (
                <> (gusts {point.windGustsKmh.toFixed(0)})</>
              )}
            </span>
            {point.precipitationMm !== null && point.precipitationMm > 0 && (
              <span className="flex items-center gap-1">
                <CloudRain size={12} /> {point.precipitationMm.toFixed(1)} mm
              </span>
            )}
          </div>
          <p className="text-[10px] text-ink-faint">Observed {formatTime(point.observedAt)}</p>
        </>
      )}
    </div>
  );
}

/**
 * Real, live weather conditions at major global shipping chokepoints and
 * container ports (Open-Meteo, free/no-key). "Elevated" is a transparent,
 * fixed threshold on real wind-gust/precipitation data — not a fabricated
 * risk score, and it makes no claim about actual delays or congestion.
 */
export function TradeRouteConditions() {
  const { data, isLoading } = usePortConditions();

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Global Trade Route Conditions</h2>
          <p className="text-xs text-ink-faint">
            Live weather at major shipping chokepoints and ports. &ldquo;Elevated&rdquo; flags wind gusts ≥60 km/h
            or precipitation ≥8 mm — a fixed, transparent threshold, not a certified risk score.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="card h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(data?.points ?? []).map((point) => (
            <ConditionCard key={point.id} point={point} />
          ))}
        </div>
      )}
    </div>
  );
}
