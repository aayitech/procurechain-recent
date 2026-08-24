import type { ComponentType } from 'react';
import { TcoCalculator } from './calculators/TcoCalculator';
import { LandedCostCalculator } from './calculators/LandedCostCalculator';
import { SupplierComparisonCalculator } from './calculators/SupplierComparisonCalculator';
import { CurrencyImpactCalculator } from './calculators/CurrencyImpactCalculator';
import { FreightCostCalculator } from './calculators/FreightCostCalculator';
import { EoqCalculator } from './calculators/EoqCalculator';
import { SavingsCalculator } from './calculators/SavingsCalculator';
import { CarbonFootprintCalculator } from './calculators/CarbonFootprintCalculator';
import { WorkingCapitalCalculator } from './calculators/WorkingCapitalCalculator';
import { RfqEfficiencyCalculator } from './calculators/RfqEfficiencyCalculator';
import { ProcurementRoiCalculator } from './calculators/ProcurementRoiCalculator';
import { BidEvaluationCalculator } from './calculators/BidEvaluationCalculator';

export const CALCULATOR_REGISTRY: Record<string, ComponentType> = {
  tco: TcoCalculator,
  'landed-cost': LandedCostCalculator,
  'supplier-comparison': SupplierComparisonCalculator,
  'currency-impact': CurrencyImpactCalculator,
  'freight-cost': FreightCostCalculator,
  eoq: EoqCalculator,
  savings: SavingsCalculator,
  'carbon-footprint': CarbonFootprintCalculator,
  'working-capital': WorkingCapitalCalculator,
  'rfq-efficiency': RfqEfficiencyCalculator,
  'procurement-roi': ProcurementRoiCalculator,
  'bid-evaluation': BidEvaluationCalculator,
};
