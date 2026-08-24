'use client';

import { usePreferencesStore } from '@/store/preferences-store';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';
import { useCommodityList } from '@/hooks/useMarketIntelligence';
import { useNews } from '@/hooks/useNews';
import { filterNewsByKeywords, keywordsFrom } from '@/lib/related-news';
import { COUNTRY_OPTIONS } from '@/lib/currencies';
import { ChangeBadge } from '@/components/market-intelligence/ChangeBadge';

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function YourMarket() {
  const { country, setCountry } = usePreferencesStore();
  const { currencyCode, convert } = useCurrencyConversion();
  const { data: commodities } = useCommodityList();
  const { data: news } = useNews();

  const rate = convert(1);
  const localNews = country ? filterNewsByKeywords(news ?? [], keywordsFrom(country), 4) : [];
  const highlights = (commodities ?? []).slice(0, 4);

  return (
    <div className="card p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink">Your Market</p>
          <p className="text-xs text-ink-faint">Personalized to your selected country and currency</p>
        </div>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="rounded-md border border-border-subtle bg-canvas-raised px-2 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
        >
          <option value="">Select your country…</option>
          {COUNTRY_OPTIONS.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">Currency</p>
          {rate.isUsd ? (
            <p className="text-sm text-ink-muted">
              {rate.isTracked ? 'USD selected' : `No live rate for ${currencyCode} yet — showing USD`}
            </p>
          ) : (
            <>
              <p className="font-mono text-lg text-ink">
                1 USD = {rate.rate?.toFixed(4)} {rate.currencyCode}
              </p>
              {rate.rateAsOf && <p className="text-[11px] text-ink-faint">Updated {formatTime(rate.rateAsOf)}</p>}
            </>
          )}
        </div>

        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">Commodity Highlights</p>
          <ul className="flex flex-col gap-1.5">
            {highlights.map((c) => (
              <li key={c.symbol} className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">{c.name}</span>
                <ChangeBadge value={c.change7d} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">Local Procurement News</p>
          {!country ? (
            <p className="text-xs text-ink-faint">Select a country to see matching headlines from our tracked feeds.</p>
          ) : localNews.length === 0 ? (
            <p className="text-xs text-ink-faint">No headlines mentioning {country} in our tracked feeds right now.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {localNews.map((article) => (
                <li key={article.link}>
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-xs text-ink hover:text-accent">
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-4 border-t border-border-subtle pt-3 text-[10px] text-ink-faint">
        Inflation, local fuel prices, and local freight updates aren&apos;t wired up yet — shown as
        planned rather than filled with invented numbers.
      </p>
    </div>
  );
}
