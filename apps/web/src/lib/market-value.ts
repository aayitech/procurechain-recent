export interface MarketValueDescriptor {
  category: string;
  unit: string;
  currency?: string;
}

export function isMonetaryMarketValue(value: MarketValueDescriptor): boolean {
  const category = value.category.toLowerCase();
  const unit = value.unit.toLowerCase();
  return Boolean(value.currency) &&
    !category.includes('economic indicator') &&
    !unit.includes('percent') &&
    !unit.includes('%') &&
    !unit.includes('index');
}

export function marketValueUnit(currency: string, unit: string, monetary: boolean): string {
  return monetary ? [currency, unit].filter(Boolean).join(' · ') : unit;
}
