import type { LucideIcon } from 'lucide-react';
import {
  Calculator,
  ClipboardList,
  Container,
  DollarSign,
  Globe2,
  Leaf,
  PackageSearch,
  Scale,
  Ship,
  TrendingUp,
  Wallet,
} from 'lucide-react';

export type CalculatorCategory = 'Cost & Commercial' | 'Sourcing' | 'Logistics' | 'Procurement Performance' | 'Sustainability';

export const CALCULATOR_CATEGORY_ORDER: CalculatorCategory[] = [
  'Cost & Commercial',
  'Sourcing',
  'Logistics',
  'Procurement Performance',
  'Sustainability',
];

export interface CalculatorDef {
  slug: string;
  name: string;
  description: string;
  estimatedTime: string;
  icon: LucideIcon;
  category: CalculatorCategory;
}

export const CALCULATORS: CalculatorDef[] = [
  {
    slug: 'tco',
    name: 'Total Cost of Ownership',
    description: 'Compare the full lifecycle cost of competing options, not just sticker price.',
    estimatedTime: '5 min',
    icon: Calculator,
    category: 'Cost & Commercial',
  },
  {
    slug: 'landed-cost',
    name: 'Landed Cost Calculator',
    description: 'Freight, duty, insurance, and handling — the real cost of an imported item.',
    estimatedTime: '4 min',
    icon: Ship,
    category: 'Cost & Commercial',
  },
  {
    slug: 'currency-impact',
    name: 'Currency Impact Calculator',
    description: 'Model how FX movement affects your landed cost exposure.',
    estimatedTime: '3 min',
    icon: Globe2,
    category: 'Cost & Commercial',
  },
  {
    slug: 'working-capital',
    name: 'Working Capital Calculator',
    description: 'See how payment terms changes ripple through working capital.',
    estimatedTime: '4 min',
    icon: Wallet,
    category: 'Cost & Commercial',
  },
  {
    slug: 'supplier-comparison',
    name: 'Supplier Comparison',
    description: 'Weighted scoring across price, quality, lead time, and risk.',
    estimatedTime: '6 min',
    icon: Scale,
    category: 'Sourcing',
  },
  {
    slug: 'bid-evaluation',
    name: 'Bid Evaluation Calculator',
    description: 'A weighted scorecard that separates mandatory compliance from scored criteria.',
    estimatedTime: '6 min',
    icon: ClipboardList,
    category: 'Sourcing',
  },
  {
    slug: 'rfq-efficiency',
    name: 'RFQ Efficiency Calculator',
    description: 'Estimate the time and cost your RFQ process consumes, and the digitization opportunity.',
    estimatedTime: '3 min',
    icon: ClipboardList,
    category: 'Sourcing',
  },
  {
    slug: 'freight-cost',
    name: 'Freight Cost Calculator',
    description: 'Estimate freight spend across container and mode options.',
    estimatedTime: '4 min',
    icon: Container,
    category: 'Logistics',
  },
  {
    slug: 'eoq',
    name: 'Economic Order Quantity',
    description: 'Find the order quantity that minimizes total inventory cost.',
    estimatedTime: '3 min',
    icon: PackageSearch,
    category: 'Logistics',
  },
  {
    slug: 'savings',
    name: 'Savings Calculator',
    description: 'Track negotiated savings against baseline spend.',
    estimatedTime: '2 min',
    icon: DollarSign,
    category: 'Procurement Performance',
  },
  {
    slug: 'procurement-roi',
    name: 'Procurement ROI Calculator',
    description: 'Estimate the return on investment for a procurement technology or transformation initiative.',
    estimatedTime: '3 min',
    icon: TrendingUp,
    category: 'Procurement Performance',
  },
  {
    slug: 'carbon-footprint',
    name: 'Carbon Footprint Calculator',
    description: 'Estimate emissions associated with a given spend category.',
    estimatedTime: '5 min',
    icon: Leaf,
    category: 'Sustainability',
  },
];
