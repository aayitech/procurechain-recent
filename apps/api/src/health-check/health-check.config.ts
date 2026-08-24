// Procurement Health Check — scoring methodology as specified by the
// business (question text, answer scores, dimension weights, overall
// weights, maturity thresholds). This is the single source of truth: the
// API computes scores from this config, and the frontend renders the
// questions from the same config via GET /health-check/config — nothing
// is duplicated or hardcoded into templates on either side.

// Bumped when the question set/scoring weights change materially — synced
// to GHL as a custom field so a future "Advanced Diagnostic" (master
// prompt section 65) can be distinguished from this quick assessment.
export const HEALTH_CHECK_ASSESSMENT_VERSION = 'quick-v1';

export const DIMENSION_KEYS = [
  'sourcingEfficiency',
  'supplierCollaboration',
  'commercialIntelligence',
  'processControl',
  'procurementVisibility',
  'digitalIntegration',
  'performanceValue',
] as const;

export type DimensionKey = (typeof DIMENSION_KEYS)[number];

export const DIMENSIONS: Record<DimensionKey, { label: string; overallWeight: number; ghlField: string }> = {
  sourcingEfficiency: { label: 'Sourcing Efficiency', overallWeight: 0.2, ghlField: 'sourcing_score' },
  supplierCollaboration: { label: 'Supplier Collaboration', overallWeight: 0.15, ghlField: 'supplier_score' },
  commercialIntelligence: { label: 'Commercial Intelligence', overallWeight: 0.15, ghlField: 'commercial_score' },
  processControl: { label: 'Process Control', overallWeight: 0.15, ghlField: 'process_score' },
  procurementVisibility: { label: 'Procurement Visibility', overallWeight: 0.15, ghlField: 'visibility_score' },
  digitalIntegration: { label: 'Digital Integration', overallWeight: 0.1, ghlField: 'integration_score' },
  performanceValue: { label: 'Performance & Value', overallWeight: 0.1, ghlField: 'performance_score' },
};

export interface HealthCheckAnswerOption {
  key: 'A' | 'B' | 'C' | 'D';
  label: string;
  score: 25 | 50 | 75 | 100;
}

export interface HealthCheckQuestion {
  id: string;
  text: string;
  answers: HealthCheckAnswerOption[];
  dimensionWeights: Partial<Record<DimensionKey, number>>;
}

export const HEALTH_CHECK_QUESTIONS: HealthCheckQuestion[] = [
  {
    id: 'q1',
    text: 'How does your team currently manage RFQs?',
    answers: [
      { key: 'A', label: 'Mostly email, Excel and manual processes', score: 25 },
      { key: 'B', label: 'ERP + spreadsheets/manual processes', score: 50 },
      { key: 'C', label: 'Dedicated procurement system', score: 75 },
      { key: 'D', label: 'Connected/automated sourcing workflow', score: 100 },
    ],
    dimensionWeights: { sourcingEfficiency: 0.4, processControl: 0.3, digitalIntegration: 0.3 },
  },
  {
    id: 'q2',
    text: 'How do suppliers normally submit quotations?',
    answers: [
      { key: 'A', label: 'Email / attachments', score: 25 },
      { key: 'B', label: 'Multiple channels', score: 50 },
      { key: 'C', label: 'Supplier portal', score: 75 },
      { key: 'D', label: 'Structured digital submission', score: 100 },
    ],
    dimensionWeights: { supplierCollaboration: 0.7, sourcingEfficiency: 0.3 },
  },
  {
    id: 'q3',
    text: 'How are supplier quotations compared?',
    answers: [
      { key: 'A', label: 'Manually in Excel', score: 25 },
      { key: 'B', label: 'Excel + ERP', score: 50 },
      { key: 'C', label: 'Procurement software', score: 75 },
      { key: 'D', label: 'Standardized/automated comparison', score: 100 },
    ],
    dimensionWeights: { commercialIntelligence: 0.6, sourcingEfficiency: 0.4 },
  },
  {
    id: 'q4',
    text: 'How quickly can your team move from RFQ release to sourcing decision?',
    answers: [
      { key: 'A', label: 'More than a week', score: 25 },
      { key: 'B', label: '3–7 days', score: 50 },
      { key: 'C', label: '1–3 days', score: 75 },
      { key: 'D', label: 'Same day / highly automated', score: 100 },
    ],
    dimensionWeights: { sourcingEfficiency: 0.7, performanceValue: 0.3 },
  },
  {
    id: 'q5',
    text: 'Can you see the complete sourcing history — request, RFQ, suppliers, quotes, comparison, award?',
    answers: [
      { key: 'A', label: 'No', score: 25 },
      { key: 'B', label: 'Partially', score: 50 },
      { key: 'C', label: 'Mostly', score: 75 },
      { key: 'D', label: 'Completely', score: 100 },
    ],
    dimensionWeights: { procurementVisibility: 0.6, processControl: 0.4 },
  },
  {
    id: 'q6',
    text: 'How effectively do you measure procurement performance?',
    answers: [
      { key: 'A', label: "We don't consistently measure it", score: 25 },
      { key: 'B', label: 'Basic reporting', score: 50 },
      { key: 'C', label: 'Regular procurement KPIs', score: 75 },
      { key: 'D', label: 'Real-time/automated analytics', score: 100 },
    ],
    dimensionWeights: { performanceValue: 0.6, procurementVisibility: 0.4 },
  },
  {
    id: 'q7',
    text: 'How centralized is supplier information?',
    answers: [
      { key: 'A', label: 'Spreadsheets/email', score: 25 },
      { key: 'B', label: 'Multiple systems', score: 50 },
      { key: 'C', label: 'Central supplier database', score: 75 },
      { key: 'D', label: 'Connected supplier ecosystem', score: 100 },
    ],
    dimensionWeights: { supplierCollaboration: 0.6, procurementVisibility: 0.4 },
  },
  {
    id: 'q8',
    text: 'How connected is procurement to your ERP?',
    answers: [
      { key: 'A', label: 'Mostly separate', score: 25 },
      { key: 'B', label: 'Some integration', score: 50 },
      { key: 'C', label: 'Well integrated', score: 75 },
      { key: 'D', label: 'Fully connected', score: 100 },
    ],
    dimensionWeights: { digitalIntegration: 0.7, processControl: 0.3 },
  },
];

export interface MaturityLevel {
  key: string;
  label: string;
  min: number;
  max: number;
  description: string;
}

export const MATURITY_LEVELS: MaturityLevel[] = [
  { key: 'manual', label: 'Manual', min: 0, max: 39, description: 'Procurement runs mostly on manual, ad hoc processes — the foundation for real gains is standardizing the basics.' },
  { key: 'developing', label: 'Developing', min: 40, max: 59, description: 'Some structure is in place, but it relies heavily on individual effort rather than a repeatable system.' },
  { key: 'structured', label: 'Structured', min: 60, max: 74, description: 'Core procurement processes are consistent and documented, with room to connect them more tightly together.' },
  { key: 'advanced', label: 'Advanced', min: 75, max: 89, description: 'Procurement is well integrated and data-driven, with targeted opportunities left to fully automate.' },
  { key: 'optimized', label: 'Optimized', min: 90, max: 100, description: 'Procurement operates as a connected, automated, and continuously measured function.' },
];

export interface DimensionRecommendation {
  opportunityLabel: string;
  actions: string[];
  links: Array<{ label: string; href: string }>;
}

// Only ever link to pages that actually exist on this site — no invented
// guide/article URLs.
export const DIMENSION_RECOMMENDATIONS: Record<DimensionKey, DimensionRecommendation> = {
  sourcingEfficiency: {
    opportunityLabel: 'RFQ creation, supplier response handling and quotation comparison may still involve significant manual work.',
    actions: ['Standardize RFQ creation', 'Centralize supplier responses', 'Standardize quotation comparison'],
    links: [
      { label: 'Supplier Comparison Calculator', href: '/calculators/supplier-comparison' },
      { label: 'Economic Order Quantity Calculator', href: '/calculators/eoq' },
      { label: 'How to Run an RFQ', href: '/knowledge-centre/how-to-run-an-rfq' },
    ],
  },
  supplierCollaboration: {
    opportunityLabel: 'Supplier information and quotation submission may be scattered across email and spreadsheets rather than a shared system.',
    actions: ['Centralize supplier records in one place', 'Standardize how suppliers submit quotations', 'Track supplier communication in one system'],
    links: [{ label: 'Supplier Comparison Calculator', href: '/calculators/supplier-comparison' }],
  },
  commercialIntelligence: {
    opportunityLabel: 'Comparing supplier quotations and pricing against real market movement may still be a manual, spreadsheet-driven exercise.',
    actions: ['Standardize quotation comparison criteria', 'Track relevant commodity and FX movements alongside quotes', 'Benchmark quotes against live market data'],
    links: [
      { label: 'Market Intelligence Centre', href: '/market-intelligence' },
      { label: 'Currency Impact Calculator', href: '/calculators/currency-impact' },
      { label: 'How to Compare Supplier Quotations', href: '/knowledge-centre/how-to-compare-supplier-quotations' },
      { label: 'How to Calculate Total Cost of Ownership', href: '/knowledge-centre/how-to-calculate-total-cost-of-ownership' },
    ],
  },
  processControl: {
    opportunityLabel: 'End-to-end control from RFQ release through award may rely on individual follow-up rather than a documented process.',
    actions: ['Document the RFQ-to-award process', 'Connect procurement steps to your ERP', 'Track cycle time from release to decision'],
    links: [
      { label: 'Total Cost of Ownership Calculator', href: '/calculators/tco' },
      { label: 'Working Capital Calculator', href: '/calculators/working-capital' },
    ],
  },
  procurementVisibility: {
    opportunityLabel: 'Full visibility across the sourcing history — request through award — may still be partial or hard to reconstruct.',
    actions: ['Centralize sourcing history in one place', 'Make supplier and pricing data queryable, not just archived', 'Review market context alongside sourcing decisions'],
    links: [
      { label: 'Market Intelligence Centre', href: '/market-intelligence' },
      { label: 'AI Procurement Assistant', href: '/assistant' },
    ],
  },
  digitalIntegration: {
    opportunityLabel: 'Procurement and your ERP may still operate as largely separate systems, creating duplicate data entry.',
    actions: ['Map where procurement and ERP data currently diverge', 'Prioritize integrating the highest-friction step first', 'Use a connected workflow for new RFQs going forward'],
    links: [{ label: 'AI Procurement Assistant', href: '/assistant' }],
  },
  performanceValue: {
    opportunityLabel: 'Procurement performance and savings may not be measured consistently enough to demonstrate value reliably.',
    actions: ['Define a small set of core procurement KPIs', 'Track savings against a documented baseline', 'Review performance on a regular cadence'],
    links: [
      { label: 'Savings Calculator', href: '/calculators/savings' },
      { label: 'Total Cost of Ownership Calculator', href: '/calculators/tco' },
    ],
  },
};
