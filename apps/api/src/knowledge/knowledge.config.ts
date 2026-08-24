import type { DimensionKey } from '../health-check/health-check.config';

export type ResourceType = 'Guide' | 'Article' | 'PDF' | 'Video';

export interface KnowledgeResource {
  title: string;
  source: string;
  type: ResourceType;
  url: string;
  whatYouWillLearn: string;
  whyItMatters: string;
  // Every resource here was checked with a real HTTP request before being
  // added — see verifiedAt. Never add a resource without doing this.
  verifiedAt: string;
}

export interface LearningPathStep {
  title: string;
  detail: string;
}

export interface RelatedTool {
  label: string;
  href: string;
}

export interface LearningPath {
  slug: string;
  title: string;
  objective: string;
  whoItIsFor: string;
  whenToUseIt: string;
  steps: LearningPathStep[];
  commonMistakes: string[];
  relatedTools: RelatedTool[];
  relatedDimension: DimensionKey;
  resources: KnowledgeResource[];
  comingSoon?: boolean;
}

// 3 fully built paths with real, individually-verified resources (checked
// 2026-08-18 via direct HTTP request — see verifiedAt on each). The
// remaining 13 are architecture-only stubs (comingSoon: true, no
// resources) so the shape and cross-linking already work when they're
// filled in later — never populate a stub's resources without the same
// verification pass.
export const LEARNING_PATHS: LearningPath[] = [
  {
    slug: 'how-to-run-an-rfq',
    title: 'How to Run an RFQ',
    objective: 'Run a Request for Quotation process that gets comparable, decision-ready pricing from suppliers.',
    whoItIsFor: 'Buyers and category managers running routine or repeat purchases where price and delivery are the main decision factors.',
    whenToUseIt: 'When you need competitive pricing for a well-defined, off-the-shelf good or service and a full tender process would be overkill.',
    steps: [
      { title: 'Define the specification', detail: 'Write a clear, unambiguous description of what you need — quantity, quality standard, delivery timeline — so every supplier quotes on the same basis.' },
      { title: 'Select suppliers to invite', detail: 'Choose a shortlist (CIPS guidance suggests at least three) of suppliers capable of meeting the specification.' },
      { title: 'Send the RFQ', detail: 'Issue the same document and deadline to every invited supplier, including how quotations will be compared.' },
      { title: 'Collect and validate quotations', detail: 'Check each quotation actually responds to the specification before comparing on price.' },
      { title: 'Compare and award', detail: 'Compare quotations against your predefined criteria — not price alone unless that is deliberately your only criterion.' },
    ],
    commonMistakes: [
      'Sending an unclear specification, so quotations aren\'t actually comparable',
      'Comparing on price alone when quality, lead time, or risk should also matter',
      'Not telling suppliers upfront how the decision will be made',
    ],
    relatedTools: [
      { label: 'RFQ Efficiency Calculator', href: '/calculators/rfq-efficiency' },
      { label: 'Bid Evaluation Calculator', href: '/calculators/bid-evaluation' },
    ],
    relatedDimension: 'sourcingEfficiency',
    resources: [
      {
        title: 'Procurement Supply Cycle',
        source: 'CIPS (Chartered Institute of Procurement & Supply)',
        type: 'Guide',
        url: 'https://www.cips.org/intelligence-hub/procurement/procurement-supply-cycle',
        whatYouWillLearn: 'Where the RFQ/sourcing stage fits in the end-to-end procurement cycle.',
        whyItMatters: 'Running an RFQ well depends on the specification and supplier-selection steps that come before it.',
        verifiedAt: '2026-08-18',
      },
      {
        title: 'Sourcing',
        source: 'CIPS',
        type: 'Guide',
        url: 'https://www.cips.org/intelligence-hub/sourcing',
        whatYouWillLearn: 'How sourcing methods, including RFQs, fit into a broader sourcing strategy.',
        whyItMatters: 'Helps you decide when an RFQ is the right tool versus a full tender.',
        verifiedAt: '2026-08-18',
      },
      {
        title: 'What is Tendering and Types of Tendering',
        source: 'CIPS',
        type: 'Guide',
        url: 'https://www.cips.org/intelligence-hub/quality-measurement/tender-process',
        whatYouWillLearn: 'The difference between RFQs, invitations to tender, and other competitive processes.',
        whyItMatters: 'Picking the wrong process type is a common cause of wasted supplier and buyer time.',
        verifiedAt: '2026-08-18',
      },
      {
        title: 'Procurement Specifications – Types of Specifications',
        source: 'CIPS',
        type: 'Guide',
        url: 'https://www.cips.org/intelligence-hub/procurement/procurement-specifications',
        whatYouWillLearn: 'How to write a specification suppliers can actually quote against.',
        whyItMatters: 'An unclear specification is the single most common reason RFQ responses aren\'t comparable.',
        verifiedAt: '2026-08-18',
      },
      {
        title: 'Finding Business Opportunities: Procurement Guidance',
        source: 'World Bank',
        type: 'PDF',
        url: 'https://thedocs.worldbank.org/en/doc/02dfc125b8474462b40cdcb71fbfc931-0290012024/original/WB-Finding-Business-Opportunities-WEB-FINAL.pdf',
        whatYouWillLearn: 'How RFQs are used as a procurement method in large development-institution procurement.',
        whyItMatters: 'Shows how the same RFQ discipline applies at a much larger scale than routine corporate buying.',
        verifiedAt: '2026-08-18',
      },
    ],
  },
  {
    slug: 'how-to-compare-supplier-quotations',
    title: 'How to Compare Supplier Quotations',
    objective: 'Evaluate competing supplier quotations on a consistent, defensible basis instead of price alone.',
    whoItIsFor: 'Buyers and sourcing managers who regularly receive multiple quotations and need to justify a supplier choice.',
    whenToUseIt: 'After quotations have been received and before an award decision is made.',
    steps: [
      { title: 'Set your comparison criteria upfront', detail: 'Decide what matters — price, quality, lead time, payment terms, risk — before you see any quotation.' },
      { title: 'Weight the criteria', detail: 'Assign relative weights so the comparison reflects what actually matters for this purchase.' },
      { title: 'Normalize the data', detail: 'Put each supplier\'s figures on the same basis (currency, unit, Incoterm) before comparing.' },
      { title: 'Score each supplier', detail: 'Apply your weighted criteria consistently across every quotation.' },
      { title: 'Document why the winner won', detail: 'Record the reasoning, not just the outcome, in case the decision is questioned later.' },
    ],
    commonMistakes: [
      'Letting price dominate the decision by default rather than by deliberate weighting',
      'Comparing quotations that were priced against slightly different specifications',
      'Not documenting the reasoning behind the final decision',
    ],
    relatedTools: [
      { label: 'Supplier Comparison Calculator', href: '/calculators/supplier-comparison' },
      { label: 'Bid Evaluation Calculator', href: '/calculators/bid-evaluation' },
    ],
    relatedDimension: 'commercialIntelligence',
    resources: [
      {
        title: 'Tender Evaluation Process - How to Evaluate Tenders',
        source: 'CIPS',
        type: 'Guide',
        url: 'https://www.cips.org/intelligence-hub/quality-measurement/tender-process/evaluation',
        whatYouWillLearn: 'A structured process for evaluating competing tenders/quotations.',
        whyItMatters: 'Gives you a defensible, repeatable evaluation process rather than an ad hoc one.',
        verifiedAt: '2026-08-18',
      },
      {
        title: 'Supplier Selection - What is the Supplier Selection Process',
        source: 'CIPS',
        type: 'Guide',
        url: 'https://www.cips.org/intelligence-hub/managing-suppliers/supplier-selection',
        whatYouWillLearn: 'How supplier selection criteria are typically structured.',
        whyItMatters: 'Comparing quotations is really supplier selection under a deadline — the same discipline applies.',
        verifiedAt: '2026-08-18',
      },
      {
        title: 'Supplier Evaluation - How to Evaluate Suppliers',
        source: 'CIPS',
        type: 'Guide',
        url: 'https://www.cips.org/intelligence-hub/managing-suppliers/supplier-evaluation',
        whatYouWillLearn: 'How ongoing supplier evaluation criteria are built, beyond a single quotation.',
        whyItMatters: 'The criteria you use to compare quotations should connect to how you\'ll evaluate the supplier afterwards.',
        verifiedAt: '2026-08-18',
      },
    ],
  },
  {
    slug: 'how-to-calculate-total-cost-of-ownership',
    title: 'How to Calculate Total Cost of Ownership',
    objective: 'Understand the full lifecycle cost of an asset or contract, not just the purchase price.',
    whoItIsFor: 'Buyers evaluating capital purchases, equipment, or any contract where price, maintenance, and operating costs diverge across suppliers.',
    whenToUseIt: 'Whenever the cheapest quotation might not be the cheapest option once you own or operate the item.',
    steps: [
      { title: 'List every cost category', detail: 'Purchase price, freight, installation, maintenance, energy, consumables, downtime, training, disposal.' },
      { title: 'Set the time horizon', detail: 'Use the asset\'s realistic useful life, not an arbitrary period.' },
      { title: 'Total each supplier\'s lifecycle cost', detail: 'Sum every cost category across the full time horizon for each option being compared.' },
      { title: 'Compare lowest price vs. lowest TCO', detail: 'The two are often different suppliers — that gap is the whole point of doing this.' },
      { title: 'Sense-check the assumptions', detail: 'TCO is only as reliable as its maintenance/energy/downtime assumptions — state them explicitly.' },
    ],
    commonMistakes: [
      'Comparing only purchase price and ignoring maintenance/operating cost differences',
      'Using an inconsistent time horizon across suppliers being compared',
      'Leaving out disposal/end-of-life costs entirely',
    ],
    relatedTools: [
      { label: 'Total Cost of Ownership Calculator', href: '/calculators/tco' },
      { label: 'Landed Cost Calculator', href: '/calculators/landed-cost' },
    ],
    relatedDimension: 'commercialIntelligence',
    resources: [
      {
        title: 'Total Cost of Ownership',
        source: 'CIPS',
        type: 'Guide',
        url: 'https://www.cips.org/intelligence-hub/finance/total-cost-of-ownership',
        whatYouWillLearn: 'CIPS\'s structured definition of TCO and its main cost categories.',
        whyItMatters: 'A shared, standard definition of TCO is what makes cross-supplier comparisons defensible.',
        verifiedAt: '2026-08-18',
      },
      {
        title: 'Whole Life Costing - What is Whole Life Costing',
        source: 'CIPS',
        type: 'Guide',
        url: 'https://www.cips.org/intelligence-hub/finance/whole-life-costing',
        whatYouWillLearn: 'How whole life costing extends TCO thinking to high-value or high-risk procurement decisions.',
        whyItMatters: 'For major purchases, whole life costing is the more rigorous sibling of a basic TCO calculation.',
        verifiedAt: '2026-08-18',
      },
      {
        title: 'Understanding Total Cost of Ownership in Procurement',
        source: 'ISM (Institute for Supply Management)',
        type: 'Article',
        url: 'https://www.ism.ws/supply-chain/ownership-in-procurement/',
        whatYouWillLearn: 'A second, independent perspective on TCO from a recognized US supply-management body.',
        whyItMatters: 'Useful to see the same concept applied consistently across different professional bodies.',
        verifiedAt: '2026-08-18',
      },
    ],
  },

  // Architecture-only stubs — titles from the agreed 16-path curriculum,
  // no resources yet. Fill in following the exact same real-URL
  // verification process used for the 3 paths above; never populate
  // `resources` without it.
  { slug: 'how-to-evaluate-suppliers', title: 'How to Evaluate Suppliers', objective: '', whoItIsFor: '', whenToUseIt: '', steps: [], commonMistakes: [], relatedTools: [], relatedDimension: 'supplierCollaboration', resources: [], comingSoon: true },
  { slug: 'how-to-build-a-supplier-scorecard', title: 'How to Build a Supplier Scorecard', objective: '', whoItIsFor: '', whenToUseIt: '', steps: [], commonMistakes: [], relatedTools: [], relatedDimension: 'supplierCollaboration', resources: [], comingSoon: true },
  { slug: 'how-to-conduct-strategic-sourcing', title: 'How to Conduct Strategic Sourcing', objective: '', whoItIsFor: '', whenToUseIt: '', steps: [], commonMistakes: [], relatedTools: [], relatedDimension: 'sourcingEfficiency', resources: [], comingSoon: true },
  { slug: 'how-to-calculate-landed-cost', title: 'How to Calculate Landed Cost', objective: '', whoItIsFor: '', whenToUseIt: '', steps: [], commonMistakes: [], relatedTools: [], relatedDimension: 'commercialIntelligence', resources: [], comingSoon: true },
  { slug: 'how-to-negotiate-with-suppliers', title: 'How to Negotiate with Suppliers', objective: '', whoItIsFor: '', whenToUseIt: '', steps: [], commonMistakes: [], relatedTools: [], relatedDimension: 'commercialIntelligence', resources: [], comingSoon: true },
  { slug: 'how-to-manage-supplier-risk', title: 'How to Manage Supplier Risk', objective: '', whoItIsFor: '', whenToUseIt: '', steps: [], commonMistakes: [], relatedTools: [], relatedDimension: 'supplierCollaboration', resources: [], comingSoon: true },
  { slug: 'how-to-build-procurement-kpis', title: 'How to Build Procurement KPIs', objective: '', whoItIsFor: '', whenToUseIt: '', steps: [], commonMistakes: [], relatedTools: [], relatedDimension: 'performanceValue', resources: [], comingSoon: true },
  { slug: 'how-to-perform-spend-analysis', title: 'How to Perform Spend Analysis', objective: '', whoItIsFor: '', whenToUseIt: '', steps: [], commonMistakes: [], relatedTools: [], relatedDimension: 'procurementVisibility', resources: [], comingSoon: true },
  { slug: 'how-to-build-a-category-strategy', title: 'How to Build a Category Strategy', objective: '', whoItIsFor: '', whenToUseIt: '', steps: [], commonMistakes: [], relatedTools: [], relatedDimension: 'sourcingEfficiency', resources: [], comingSoon: true },
  { slug: 'how-to-digitalize-procurement', title: 'How to Digitalize Procurement', objective: '', whoItIsFor: '', whenToUseIt: '', steps: [], commonMistakes: [], relatedTools: [], relatedDimension: 'digitalIntegration', resources: [], comingSoon: true },
  { slug: 'how-to-build-a-procurement-transformation-strategy', title: 'How to Build a Procurement Transformation Strategy', objective: '', whoItIsFor: '', whenToUseIt: '', steps: [], commonMistakes: [], relatedTools: [], relatedDimension: 'digitalIntegration', resources: [], comingSoon: true },
  { slug: 'japanese-procurement-and-lean-thinking', title: 'Japanese Procurement & Lean Thinking', objective: '', whoItIsFor: '', whenToUseIt: '', steps: [], commonMistakes: [], relatedTools: [], relatedDimension: 'processControl', resources: [], comingSoon: true },
  { slug: 'procurement-and-business-strategy', title: 'Procurement & Business Strategy', objective: '', whoItIsFor: '', whenToUseIt: '', steps: [], commonMistakes: [], relatedTools: [], relatedDimension: 'performanceValue', resources: [], comingSoon: true },
];
