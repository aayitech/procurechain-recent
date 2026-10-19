export interface BuyerCampaign {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  promise: string;
  description: string;
  primaryCta: string;
  primaryHref: string;
  primaryAsset: string;
  audience: string;
  proof: string[];
  nextStep: string;
  tools: Array<{ title: string; description: string; href: string }>;
  product: string;
  defaultProductInterest?: string;
}

export const BUYER_CAMPAIGNS: BuyerCampaign[] = [
  {
    slug: 'procurement-health',
    label: 'Procurement Health',
    eyebrow: 'Procurement Health Check',
    title: 'How healthy is your procurement operation?',
    promise: 'See where your process is working well, where value may be leaking, and what to improve next.',
    description: 'Answer eight questions and get your Procurement Performance Index with practical improvement areas. It takes about three minutes and you can see your result without booking a demo.',
    primaryCta: 'Take the free Health Check',
    primaryHref: '/health-check',
    primaryAsset: 'procurement-health-check',
    audience: 'Procurement, finance, operations, and supply chain leaders',
    proof: ['8 questions · about 3 minutes', 'Your score and maturity level', 'Recommended next steps and relevant tools'],
    nextStep: 'Use the result to choose the right calculator, insight, or product conversation for the gap you found.',
    tools: [
      { title: 'RFQ Efficiency Calculator', description: 'Estimate the time and cost tied up in your sourcing process.', href: '/calculators/rfq-efficiency' },
      { title: 'Supplier Comparison', description: 'Compare supplier offers against the criteria that matter.', href: '/calculators/supplier-comparison' },
      { title: 'Market Brief', description: 'Keep up with procurement and market movements.', href: '/market-brief' },
    ],
    product: 'the area identified in your Health Check',
  },
  {
    slug: 'procurement-savings',
    label: 'Procurement Savings',
    eyebrow: 'Quantify an opportunity',
    title: 'Where could procurement be leaving money on the table?',
    promise: 'Model a procurement opportunity using your own assumptions before starting a software conversation.',
    description: 'Explore the financial impact of savings, total cost, working capital, currency, and landed cost. The calculators are available to use without a sales call.',
    primaryCta: 'Open the Savings Calculator',
    primaryHref: '/calculators/savings',
    primaryAsset: 'savings-calculator',
    audience: 'CFOs, finance directors, procurement leaders, and category managers',
    proof: ['Use your own assumptions', 'Compare cost drivers beyond unit price', 'No company spend or savings are assumed for you'],
    nextStep: 'When you have identified an opportunity, explore how spend visibility can help your team decide where to act.',
    tools: [
      { title: 'Procurement ROI', description: 'Model a procurement technology or transformation case.', href: '/calculators/procurement-roi' },
      { title: 'Total Cost of Ownership', description: 'Include freight, currency, and other cost factors in a comparison.', href: '/calculators/tco' },
      { title: 'Working Capital', description: 'See how payment terms can affect working capital.', href: '/calculators/working-capital' },
    ],
    product: 'SPEND IQ',
    defaultProductInterest: 'SPEND IQ',
  },
  {
    slug: 'procurement-intelligence',
    label: 'Procurement Intelligence',
    eyebrow: 'Market context for buying decisions',
    title: 'Know what is moving before you negotiate.',
    promise: 'Explore market signals and ask practical procurement questions about the things your organisation buys.',
    description: 'Use commodity and FX intelligence, the Market Brief, and Ask the Market to understand what changed and what it could mean for a buying decision.',
    primaryCta: 'Explore Market Intelligence',
    primaryHref: '/market-intelligence',
    primaryAsset: 'market-intelligence-hub',
    audience: 'Strategic buyers, category managers, sourcing teams, and supply chain professionals',
    proof: ['Review tracked commodity and FX movements', 'See market context and procurement implications', 'Ask a question grounded in available market data'],
    nextStep: 'Use market context to shape a sourcing decision, then connect the insight to the workflow that acts on it.',
    tools: [
      { title: 'Ask before you buy', description: 'Ask what a market movement could mean for procurement.', href: '/assistant?q=What%20should%20I%20watch%20before%20negotiating%20an%20imported%20purchase%3F' },
      { title: 'Read the Market Brief', description: 'Get a concise view of market movement and procurement implications.', href: '/market-brief' },
      { title: 'Currency Impact Calculator', description: 'Model how exchange-rate changes affect an imported purchase.', href: '/calculators/currency-impact' },
    ],
    product: 'market intelligence and sourcing workflows',
    defaultProductInterest: 'SOURCE IQ',
  },
];

export function getBuyerCampaign(slug: string) {
  return BUYER_CAMPAIGNS.find((campaign) => campaign.slug === slug);
}
