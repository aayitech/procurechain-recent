import { PrismaClient, DataStatus, InstrumentType } from '@prisma/client';
import { DATA_SOURCE_REGISTRY } from '../src/market-data/source-registry';

const prisma = new PrismaClient();

const groups: Array<[string, InstrumentType, string[]]> = [
  ['Energy & Fuels', InstrumentType.COMMODITY, ['Brent crude', 'WTI crude', 'Dubai crude', 'Petrol (South Africa)', 'Diesel (South Africa)', 'Jet fuel', 'LPG', 'Natural gas', 'LNG', 'Coal', 'Electricity', 'Fuel oil', 'Marine fuel / bunker fuel']],
  ['Metals', InstrumentType.COMMODITY, ['Iron ore', 'Steel', 'Aluminium', 'Copper', 'Zinc', 'Nickel', 'Lead', 'Tin', 'Manganese', 'Chrome', 'Cobalt', 'Gold', 'Platinum', 'Palladium', 'Stainless steel', 'Scrap steel']],
  ['Chemicals', InstrumentType.COMMODITY, ['Caustic soda', 'Sulphuric acid', 'Hydrochloric acid', 'Methanol', 'Ethanol', 'Ammonia', 'Urea', 'Phosphate', 'Potash', 'Fertiliser inputs', 'Solvents', 'Industrial chemicals']],
  ['Plastics', InstrumentType.COMMODITY, ['Polyethylene', 'HDPE', 'LDPE', 'LLDPE', 'Polypropylene', 'PVC', 'PET', 'Polystyrene', 'ABS', 'Polycarbonate', 'EVA', 'Synthetic rubber']],
  ['Packaging', InstrumentType.COMMODITY, ['Pulp', 'Kraft paper', 'Containerboard', 'Cardboard', 'Cartonboard', 'Recovered paper', 'Printing paper', 'Newsprint', 'Packaging film', 'Aluminium foil', 'Glass', 'Packaging resin']],
  ['Agriculture & Food', InstrumentType.COMMODITY, ['Wheat', 'Corn / maize', 'Soybeans', 'Soybean oil', 'Palm oil', 'Sunflower oil', 'Sugar', 'Rice', 'Cocoa', 'Coffee', 'Cotton', 'Fertiliser', 'Livestock', 'Dairy inputs', 'Feed commodities']],
  ['FX & Currencies', InstrumentType.FX, ['USD/ZAR', 'EUR/ZAR', 'GBP/ZAR', 'CNY/ZAR', 'JPY/ZAR', 'AED/ZAR', 'CAD/ZAR', 'AUD/ZAR', 'USD/EUR', 'USD/CNY', 'EUR/CNY']],
  ['Freight', InstrumentType.FREIGHT, ['China → Durban · 20FT', 'China → Durban · 40FT', 'China → Durban · 40HC', 'China → Cape Town · 20FT', 'China → Cape Town · 40FT', 'China → Cape Town · 40HC', 'China → Ngqura · 20FT', 'China → Ngqura · 40FT', 'China → Ngqura · 40HC', 'India → South Africa', 'Europe → South Africa', 'Middle East → South Africa', 'North America → South Africa', 'South America → South Africa']],
  ['Ports', InstrumentType.PORT, ['Durban', 'Cape Town', 'Ngqura', 'Gqeberha']],
  ['Economics', InstrumentType.ECONOMIC, ['Inflation', 'CPI', 'PPI', 'GDP', 'GDP growth', 'Interest rates', 'Central bank rates', 'Industrial production', 'Manufacturing indicators', 'Employment', 'Trade balance', 'Producer prices', 'Consumer indicators']],
  ['Trade', InstrumentType.TRADE, ['Imports', 'Exports', 'Trade value', 'Trade volume', 'HS code trade', 'Tariffs', 'Trade restrictions', 'Trade flows']],
];

const symbol = (type: InstrumentType, name: string) => `${type}_${name.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '')}`;

async function main() {
  for (const source of DATA_SOURCE_REGISTRY) {
    const status = source.status === 'active' ? DataStatus.ACTIVE : source.status === 'configuration_required' ? DataStatus.CONFIGURATION_REQUIRED : DataStatus.UNAVAILABLE;
    await prisma.dataSource.upsert({
      where: { id: source.sourceId },
      update: { name: source.sourceName, domain: source.domain, dataTypes: source.dataType, country: source.country, region: source.region, apiAvailable: source.apiAvailable, apiEndpoint: source.apiEndpoint, apiKeyRequired: source.apiKeyRequired, updateFrequency: source.updateFrequency, historicalData: source.historicalData, commercialUse: source.commercialUse, redistributionAllowed: source.redistributionAllowed, attributionRequired: source.attributionRequired, licence: source.licence, status },
      create: { id: source.sourceId, name: source.sourceName, domain: source.domain, dataTypes: source.dataType, country: source.country, region: source.region, apiAvailable: source.apiAvailable, apiEndpoint: source.apiEndpoint, apiKeyRequired: source.apiKeyRequired, updateFrequency: source.updateFrequency, historicalData: source.historicalData, commercialUse: source.commercialUse, redistributionAllowed: source.redistributionAllowed, attributionRequired: source.attributionRequired, licence: source.licence, status },
    });
  }

  await prisma.countryConfiguration.upsert({
    where: { code: 'ZA' },
    update: {},
    create: { code: 'ZA', name: 'South Africa', currency: 'ZAR', isPrimary: true, priorityInstruments: ['COMMODITY_DIESEL_SOUTH_AFRICA', 'COMMODITY_STEEL', 'COMMODITY_POLYETHYLENE', 'FX_USD_ZAR', 'FREIGHT_CHINA_DURBAN_40HC'], ports: ['Durban', 'Cape Town', 'Ngqura', 'Gqeberha'], tradeLanes: ['China → South Africa', 'India → South Africa', 'Europe → South Africa', 'Middle East → South Africa', 'North America → South Africa'] },
  });
  await prisma.industryConfiguration.upsert({ where: { slug: 'manufacturing' }, update: {}, create: { slug: 'manufacturing', name: 'Manufacturing', priorityCategories: ['Energy & Fuels', 'Metals', 'Plastics', 'Packaging', 'FX & Currencies', 'Freight'], priorityInstruments: ['COMMODITY_DIESEL_SOUTH_AFRICA', 'COMMODITY_STEEL', 'COMMODITY_ALUMINIUM', 'COMMODITY_POLYETHYLENE', 'FX_USD_ZAR'] } });

  for (const [category, type, names] of groups) {
    for (const name of names) {
      const instrumentSymbol = symbol(type, name);
      await prisma.marketInstrument.upsert({ where: { symbol: instrumentSymbol }, update: { name, category, type }, create: { symbol: instrumentSymbol, name, category, type, country: name.includes('South Africa') || ['USD/ZAR', 'EUR/ZAR', 'GBP/ZAR', 'CNY/ZAR', 'JPY/ZAR', 'AED/ZAR', 'CAD/ZAR', 'AUD/ZAR', 'Durban', 'Cape Town', 'Ngqura', 'Gqeberha'].includes(name) ? 'South Africa' : null, status: DataStatus.UNAVAILABLE } });
    }
  }
}

main().finally(() => prisma.$disconnect());
