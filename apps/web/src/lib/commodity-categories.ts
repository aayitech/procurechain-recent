// Fixed display order for grouping the commodity list. The category strings
// must match what MarketDataService/market-fallback actually assign.
export const CATEGORY_ORDER = [
  'Economic Indicators',
  'Metals',
  'Fuel & Energy',
  'Plastics',
  'Construction Materials',
  'Chemicals',
  'Paper',
  'Packaging',
  'Agriculture',
  'Logistics & Freight',
];

// General, category-level context — not commodity-specific claims about
// today's market, just standing domain knowledge about what tends to drive
// this category's costs. Safe to state generically; never used to imply a
// live, AI-generated analysis of current conditions.
export const CATEGORY_CONTEXT: Record<string, string> = {
  'Economic Indicators': 'US macro indicators (from the Federal Reserve) that ripple into global procurement — inflation and producer prices affect input costs, and the Fed Funds Rate affects the cost of capital and USD-denominated contracts worldwide.',
  Metals: 'Metals pricing typically tracks mining output, energy costs, and industrial demand cycles — relevant to construction, manufacturing, and capital equipment spend.',
  'Fuel & Energy': 'Energy prices feed directly into freight surcharges, manufacturing input costs, and utilities spend across almost every category.',
  Plastics: 'Plastics and polymer prices generally follow oil/ethylene feedstock costs and are relevant to packaging, consumer goods, and industrial component spend.',
  'Construction Materials': 'Construction material costs affect capital projects, facilities maintenance, and infrastructure-related procurement.',
  Chemicals: 'Industrial chemical pricing affects manufacturing inputs across cleaning, water treatment, and process industries.',
  Paper: 'Paper and pulp pricing affects packaging costs and office/print supply categories.',
  Packaging: 'Packaging material costs directly affect landed cost for any physical goods category.',
  Agriculture: 'Agricultural commodity pricing is weather- and season-sensitive and affects food, beverage, and agribusiness procurement.',
  'Logistics & Freight': 'Freight costs affect landed cost across every physical goods category and are sensitive to fuel prices and capacity.',
};
