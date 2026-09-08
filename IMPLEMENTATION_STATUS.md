# ProcureChain Insight Hub implementation status

This audit compares the application with the September 2026 Insight Hub brief. Percentages measure implemented product capability, not the number of screens that exist.

## Current position

| Area | Status | Estimated completion | Evidence and remaining work |
| --- | --- | ---: | --- |
| Homepage and visual hierarchy | Strong | 85% | Personal greeting, market signals, news, category access, and Ask the Market entry exist. Final imagery and production data depth depend on connected feeds. |
| Market Intelligence terminal | Strong foundation | 80% | One-page selection, fixed chart area, full-universe search, categories, status filters, sorting, watchlist controls, source display, and honest unavailable states exist. Licensed freight, South African fuel, port, trade, plastics, and packaging feeds remain to be connected. |
| Market Brief | Functional | 75% | Visual key signals, 7D/30D movers, personalised priority, stories, procurement actions, and terminal deep links exist. Story-to-instrument relationships need persistent news mapping and more live coverage. |
| Ask the Market | Functional foundation | 70% | Full-screen workspace, profile/current-page context, persistent server conversation memory, grounded snapshot, structured rendering, and no-data safeguards exist. Rich embedded chart/source cards and authenticated conversation history management remain. |
| Personalisation | Structured | 70% | Registration captures identity, location, currency, industry, categories, commodities, purchase mix, sourcing countries, lanes, and challenges. Profile-aware ordering is active. Profile editing and server-side ranking across every feed remain. |
| Database and domain model | Production-shaped | 85% | Models now cover country/industry configuration, user profiles, sources, unified instruments/observations, freight routes, ports, news links, category relationships, watchlists, and conversations. The migration and seed are included. Existing commodity/FX tables remain for backwards-compatible ingestion during the transition. |
| Controlled source registry | Structured | 65% | The specified official/international sources are registered with licensing/configuration status. Only World Bank, IMF DataMapper, FRED, Frankfurter/ECB, Alpha Vantage, news feeds, and weather/logistics code have partial connectors today. |
| Live market coverage | Early | 25% | Current verified data depends on configured connectors. South African official fuel, licensed container rates, detailed port operations, UN Comtrade/WITS/WTO, FAO/USDA, plastics/chemicals/packaging, EIA, SARB, Stats SA, and PortWatch are not yet production-connected. |
| Production readiness | In progress | 60% | Web and API production builds pass. Deployment still requires Postgres/Redis migration, seeding, provider credentials/licence approval, ingestion monitoring, authenticated watchlist APIs, integration tests, and source-by-source data QA. |

Overall, the product experience and architecture are approximately **70% complete**, while authoritative live-data coverage is approximately **25% complete**. The remaining distance is primarily licensed/official data integration and operational hardening, not another website redesign.

## Non-negotiable deployment sequence

1. Apply the Prisma migration and seed the South Africa/manufacturing configuration.
2. Connect and validate official South African fuel, SARB, Stats SA, and EIA sources.
3. Contract and connect a licensed container-rate provider before showing freight prices.
4. Add trade, agriculture, port, plastics, chemicals, and packaging connectors in source-priority order.
5. Move watchlist persistence from browser storage to the authenticated watchlist API.
6. Add ingestion health dashboards, stale-data alerts, source timestamps, and integration tests.
7. Run acceptance tests against all 21 success criteria in the brief with a South African manufacturing user.

No unavailable instrument should be represented by generated history, an estimated price, or an inferred future date. “Data currently unavailable” remains the correct product behaviour until an approved connection is live.
