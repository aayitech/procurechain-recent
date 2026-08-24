import type { HealthCheckQuestion, HealthCheckScoreResult } from '@/types/health-check';

// Mirrors apps/api/src/health-check/health-check.config.ts exactly — used
// only if the backend is unreachable, so the assessment can still render.
// Scoring itself still requires the backend (POST /health-check/score),
// since the scoring engine is the authoritative, server-side source of truth.
export const FALLBACK_HEALTH_CHECK_QUESTIONS: HealthCheckQuestion[] = [
  {
    id: 'q1',
    text: 'How does your team currently manage RFQs?',
    answers: [
      { key: 'A', label: 'Mostly email, Excel and manual processes' },
      { key: 'B', label: 'ERP + spreadsheets/manual processes' },
      { key: 'C', label: 'Dedicated procurement system' },
      { key: 'D', label: 'Connected/automated sourcing workflow' },
    ],
  },
  {
    id: 'q2',
    text: 'How do suppliers normally submit quotations?',
    answers: [
      { key: 'A', label: 'Email / attachments' },
      { key: 'B', label: 'Multiple channels' },
      { key: 'C', label: 'Supplier portal' },
      { key: 'D', label: 'Structured digital submission' },
    ],
  },
  {
    id: 'q3',
    text: 'How are supplier quotations compared?',
    answers: [
      { key: 'A', label: 'Manually in Excel' },
      { key: 'B', label: 'Excel + ERP' },
      { key: 'C', label: 'Procurement software' },
      { key: 'D', label: 'Standardized/automated comparison' },
    ],
  },
  {
    id: 'q4',
    text: 'How quickly can your team move from RFQ release to sourcing decision?',
    answers: [
      { key: 'A', label: 'More than a week' },
      { key: 'B', label: '3–7 days' },
      { key: 'C', label: '1–3 days' },
      { key: 'D', label: 'Same day / highly automated' },
    ],
  },
  {
    id: 'q5',
    text: 'Can you see the complete sourcing history — request, RFQ, suppliers, quotes, comparison, award?',
    answers: [
      { key: 'A', label: 'No' },
      { key: 'B', label: 'Partially' },
      { key: 'C', label: 'Mostly' },
      { key: 'D', label: 'Completely' },
    ],
  },
  {
    id: 'q6',
    text: 'How effectively do you measure procurement performance?',
    answers: [
      { key: 'A', label: "We don't consistently measure it" },
      { key: 'B', label: 'Basic reporting' },
      { key: 'C', label: 'Regular procurement KPIs' },
      { key: 'D', label: 'Real-time/automated analytics' },
    ],
  },
  {
    id: 'q7',
    text: 'How centralized is supplier information?',
    answers: [
      { key: 'A', label: 'Spreadsheets/email' },
      { key: 'B', label: 'Multiple systems' },
      { key: 'C', label: 'Central supplier database' },
      { key: 'D', label: 'Connected supplier ecosystem' },
    ],
  },
  {
    id: 'q8',
    text: 'How connected is procurement to your ERP?',
    answers: [
      { key: 'A', label: 'Mostly separate' },
      { key: 'B', label: 'Some integration' },
      { key: 'C', label: 'Well integrated' },
      { key: 'D', label: 'Fully connected' },
    ],
  },
];

// Mirrors apps/api/src/health-check/health-check.config.ts + .service.ts
// computeScore() exactly — same real weighted-normalization formula, used
// only when the backend is unreachable, so the assessment still produces a
// genuine (not fabricated) result in this environment.
const ANSWER_SCORES: Record<string, number> = { A: 25, B: 50, C: 75, D: 100 };

const DIMENSION_WEIGHTS_BY_QUESTION: Record<string, Record<string, number>> = {
  q1: { sourcingEfficiency: 0.4, processControl: 0.3, digitalIntegration: 0.3 },
  q2: { supplierCollaboration: 0.7, sourcingEfficiency: 0.3 },
  q3: { commercialIntelligence: 0.6, sourcingEfficiency: 0.4 },
  q4: { sourcingEfficiency: 0.7, performanceValue: 0.3 },
  q5: { procurementVisibility: 0.6, processControl: 0.4 },
  q6: { performanceValue: 0.6, procurementVisibility: 0.4 },
  q7: { supplierCollaboration: 0.6, procurementVisibility: 0.4 },
  q8: { digitalIntegration: 0.7, processControl: 0.3 },
};

const DIMENSION_META: Record<string, { label: string; overallWeight: number }> = {
  sourcingEfficiency: { label: 'Sourcing Efficiency', overallWeight: 0.2 },
  supplierCollaboration: { label: 'Supplier Collaboration', overallWeight: 0.15 },
  commercialIntelligence: { label: 'Commercial Intelligence', overallWeight: 0.15 },
  processControl: { label: 'Process Control', overallWeight: 0.15 },
  procurementVisibility: { label: 'Procurement Visibility', overallWeight: 0.15 },
  digitalIntegration: { label: 'Digital Integration', overallWeight: 0.1 },
  performanceValue: { label: 'Performance & Value', overallWeight: 0.1 },
};

const MATURITY_LEVELS = [
  { key: 'manual', label: 'Manual', min: 0, max: 39, description: 'Procurement runs mostly on manual, ad hoc processes — the foundation for real gains is standardizing the basics.' },
  { key: 'developing', label: 'Developing', min: 40, max: 59, description: 'Some structure is in place, but it relies heavily on individual effort rather than a repeatable system.' },
  { key: 'structured', label: 'Structured', min: 60, max: 74, description: 'Core procurement processes are consistent and documented, with room to connect them more tightly together.' },
  { key: 'advanced', label: 'Advanced', min: 75, max: 89, description: 'Procurement is well integrated and data-driven, with targeted opportunities left to fully automate.' },
  { key: 'optimized', label: 'Optimized', min: 90, max: 100, description: 'Procurement operates as a connected, automated, and continuously measured function.' },
];

const DIMENSION_RECOMMENDATIONS: Record<string, { opportunityLabel: string; actions: string[]; links: Array<{ label: string; href: string }> }> = {
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

export function computeHealthCheckScoreFallback(answers: Record<string, string>): HealthCheckScoreResult {
  const weightedSum: Record<string, number> = {};
  const weightTotal: Record<string, number> = {};
  for (const key of Object.keys(DIMENSION_META)) {
    weightedSum[key] = 0;
    weightTotal[key] = 0;
  }

  for (const [questionId, answerKey] of Object.entries(answers)) {
    const score = ANSWER_SCORES[answerKey];
    const weights = DIMENSION_WEIGHTS_BY_QUESTION[questionId];
    if (score === undefined || !weights) continue;
    for (const [dimension, weight] of Object.entries(weights)) {
      weightedSum[dimension] += score * weight;
      weightTotal[dimension] += weight;
    }
  }

  const dimensions = Object.keys(DIMENSION_META).map((key) => {
    const score = weightTotal[key] > 0 ? weightedSum[key] / weightTotal[key] : 0;
    const roundedScore = Math.round(score * 10) / 10;
    const opportunity = Math.max(0, Math.round((100 - score) * 10) / 10);
    return { key, label: DIMENSION_META[key].label, score: roundedScore, opportunity };
  });

  const overallScore = Math.round(dimensions.reduce((sum, d) => sum + d.score * DIMENSION_META[d.key].overallWeight, 0) * 10) / 10;
  const maturity = MATURITY_LEVELS.find((l) => overallScore >= l.min && overallScore <= l.max) ?? MATURITY_LEVELS[0];

  const topOpportunities = [...dimensions]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((d) => ({ ...d, ...DIMENSION_RECOMMENDATIONS[d.key] }));

  return {
    overallScore,
    maturity: { key: maturity.key, label: maturity.label, description: maturity.description },
    dimensions,
    topOpportunities,
  };
}
