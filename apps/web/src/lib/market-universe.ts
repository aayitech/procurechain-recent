export type MarketUniverseKind = 'commodity' | 'fx' | 'freight' | 'port' | 'economic' | 'trade';

export interface MarketUniverseEntry {
  id: string;
  name: string;
  category: string;
  kind: MarketUniverseKind;
  country?: string;
  unit?: string;
}

function entries(category: string, kind: MarketUniverseKind, names: string[]): MarketUniverseEntry[] {
  return names.map((name) => ({
    id: `${kind}:${name.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '')}`,
    name,
    category,
    kind,
  }));
}

// This is the searchable product universe, not a price fixture. Entries without a
// connected observation are deliberately rendered as "Data currently unavailable".
export const MARKET_UNIVERSE: MarketUniverseEntry[] = [
  ...entries('Energy & Fuels', 'commodity', ['Brent crude', 'WTI crude', 'Dubai crude', 'Petrol (South Africa)', 'Diesel (South Africa)', 'Jet fuel', 'LPG', 'Natural gas', 'LNG', 'Coal', 'Electricity', 'Fuel oil', 'Marine fuel / bunker fuel']),
  ...entries('Metals', 'commodity', ['Iron ore', 'Steel', 'Aluminium', 'Copper', 'Zinc', 'Nickel', 'Lead', 'Tin', 'Manganese', 'Chrome', 'Cobalt', 'Gold', 'Platinum', 'Palladium', 'Stainless steel', 'Scrap steel']),
  ...entries('Chemicals', 'commodity', ['Caustic soda', 'Sulphuric acid', 'Hydrochloric acid', 'Methanol', 'Ethanol', 'Ammonia', 'Urea', 'Phosphate', 'Potash', 'Fertiliser inputs', 'Solvents', 'Industrial chemicals']),
  ...entries('Plastics', 'commodity', ['Polyethylene', 'HDPE', 'LDPE', 'LLDPE', 'Polypropylene', 'PVC', 'PET', 'Polystyrene', 'ABS', 'Polycarbonate', 'EVA', 'Synthetic rubber']),
  ...entries('Packaging', 'commodity', ['Pulp', 'Kraft paper', 'Containerboard', 'Cardboard', 'Cartonboard', 'Recovered paper', 'Printing paper', 'Newsprint', 'Packaging film', 'Polyethylene packaging inputs', 'Polypropylene packaging inputs', 'Aluminium foil', 'Glass', 'Packaging resin']),
  ...entries('Agriculture & Food', 'commodity', ['Wheat', 'Corn / maize', 'Soybeans', 'Soybean oil', 'Palm oil', 'Sunflower oil', 'Sugar', 'Rice', 'Cocoa', 'Coffee', 'Cotton', 'Fertiliser', 'Livestock', 'Dairy inputs', 'Feed commodities']),
  ...entries('FX & Currencies', 'fx', ['USD/ZAR', 'EUR/ZAR', 'GBP/ZAR', 'CNY/ZAR', 'JPY/ZAR', 'AED/ZAR', 'CAD/ZAR', 'AUD/ZAR', 'USD/EUR', 'USD/CNY', 'EUR/CNY']),
  ...entries('Freight', 'freight', ['China → Durban · 20FT', 'China → Durban · 40FT', 'China → Durban · 40HC', 'China → Cape Town · 20FT', 'China → Cape Town · 40FT', 'China → Cape Town · 40HC', 'China → Ngqura · 20FT', 'China → Ngqura · 40FT', 'China → Ngqura · 40HC', 'India → South Africa', 'Europe → South Africa', 'Middle East → South Africa', 'North America → South Africa', 'South America → South Africa', 'Asia → Europe', 'Asia → North America', 'Europe → North America', 'Europe → Africa', 'Asia → Middle East', 'Europe → Canada']),
  ...entries('Ports', 'port', ['Durban', 'Cape Town', 'Ngqura', 'Gqeberha']),
  ...entries('Economics', 'economic', ['Inflation', 'CPI', 'PPI', 'GDP', 'GDP growth', 'Interest rates', 'Central bank rates', 'Industrial production', 'Manufacturing indicators', 'Employment', 'Trade balance', 'Producer prices', 'Consumer indicators']),
  ...entries('Trade', 'trade', ['Imports', 'Exports', 'Trade value', 'Trade volume', 'HS code trade', 'Tariffs', 'Trade restrictions', 'Trade flows']),
];

export const MARKET_CATEGORIES = ['All', 'Energy & Fuels', 'Metals', 'Chemicals', 'Plastics', 'Agriculture & Food', 'Packaging', 'FX & Currencies', 'Freight', 'Ports', 'Economics', 'Trade'] as const;

const aliases: Record<string, string[]> = {
  BRENT: ['Brent crude'],
  DUBAI_CRUDE: ['Dubai crude'],
  WTI: ['WTI crude'],
  NATURAL_GAS: ['Natural gas'],
  NATURAL_GAS_US: ['Natural gas'],
  NATURAL_GAS_EU: ['Natural gas'],
  LNG_JAPAN: ['LNG'],
  COAL: ['Coal'],
  COAL_ZAF: ['Coal'],
  IRON_ORE: ['Iron ore'],
  ALUMINUM: ['Aluminium'],
  ALUMINIUM: ['Aluminium'],
  COPPER: ['Copper'],
  ZINC: ['Zinc'],
  NICKEL: ['Nickel'],
  LEAD: ['Lead'],
  TIN: ['Tin'],
  GOLD: ['Gold'],
  PLATINUM: ['Platinum'],
  PHOSPHATE_ROCK: ['Phosphate'],
  DAP: ['Fertiliser inputs'],
  TSP: ['Fertiliser inputs'],
  UREA: ['Urea'],
  POTASH: ['Potash'],
  WHEAT: ['Wheat'],
  CORN: ['Corn / maize'],
  SOYBEANS: ['Soybeans'],
  SOYBEAN_OIL: ['Soybean oil'],
  PALM_OIL: ['Palm oil'],
  SUNFLOWER_OIL: ['Sunflower oil'],
  SUGAR: ['Sugar'],
  RICE: ['Rice'],
  COCOA: ['Cocoa'],
  COFFEE_ARABICA: ['Coffee'],
  COFFEE_ROBUSTA: ['Coffee'],
  COTTON: ['Cotton'],
};

export function universeMatch(kind: 'commodity' | 'fx', id: string, name: string) {
  const candidates = kind === 'fx' ? [name] : [name, ...(aliases[id.toUpperCase()] ?? [])];
  return MARKET_UNIVERSE.find((entry) => entry.kind === kind && candidates.some((candidate) => entry.name.toLowerCase() === candidate.toLowerCase()));
}
