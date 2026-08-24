// A commodity/FX move is treated as "significant" for the brief at this
// 7-day % threshold — disclosed here rather than left as an opaque AI
// judgment call.
export const SIGNIFICANT_CHANGE_THRESHOLD_PCT = 3;

export const MARKET_BRIEF_SECTIONS = [
  'Executive Summary',
  'Commodity Markets',
  'FX',
  'Freight & Logistics',
  'Fuel',
  'Supplier Developments',
  'Industry Developments',
  'Africa Procurement Watch',
  'Procurement Risks',
  'What Procurement Should Watch',
  'Recommended Actions',
] as const;

// Real headlines are bucketed into these categories by keyword match
// (plain string matching, not AI) for the "Supplier & Industry
// Intelligence" section — same honesty pattern as the rest of the app:
// computed, not invented.
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Mining: ['mining', 'mine', 'ore', 'metal', 'copper', 'aluminium', 'aluminum', 'steel', 'iron'],
  Manufacturing: ['manufactur', 'factory', 'plant', 'production line', 'assembly'],
  Energy: ['oil', 'crude', 'gas', 'fuel', 'diesel', 'energy', 'refinery', 'opec'],
  Logistics: ['freight', 'shipping', 'ocean', 'carrier', 'port', 'rail', 'trucking', 'intermodal', 'container', 'air cargo', 'logistics', 'warehouse', 'fulfillment'],
  Retail: ['retail', 'walmart', 'target', 'amazon', 'store', 'inventory'],
};

export const MARKET_BRIEF_SYSTEM_INSTRUCTION = `You are the ProcureChain Procurement Market Brief writer, producing a weekly intelligence brief for procurement professionals.

Analyze procurement-relevant developments from the previous seven days using ONLY the real data snapshot and real headlines provided to you. Identify significant changes in commodity prices, FX, freight, fuel, supplier markets, logistics, regulations, tariffs and industry developments — but only among what is actually present in the snapshot.

Rules you must follow:
- Do not invent prices, percentages, events or sources. Use only the verified information in the snapshot.
- For every significant development you mention: state what changed, quantify the movement using the real number given, compare it with the stated prior period, explain the procurement implication, and identify affected categories.
- If a required section (e.g. Freight & Logistics, Fuel, Africa Procurement Watch) has no real tracked data to report, write "No live data currently tracked for this section" under that heading rather than inventing content.
- Never state a specific future price, percentage forecast, or confidence score.
- Prioritize Africa and global markets relevant to procurement where the data covers them.
- Exclude general financial news unless it has a clear procurement implication.
- Write for Procurement Directors, CPOs, Procurement Managers, Sourcing Managers, Supply Chain Directors and CFOs.

Structure your output with exactly these eleven markdown headers, in this order, each with 1-4 sentences of real, grounded content:
${MARKET_BRIEF_SECTIONS.map((s) => `### ${s}`).join('\n')}

End the "Recommended Actions" section with three concrete, practical procurement actions for the coming week, grounded only in the data given — never generic filler.`;

// Second, focused call: one procurement-relevance sentence per real
// headline picked for "Top Stories" — grounded strictly in that headline's
// own title/description, never adding outside facts.
export const TOP_STORIES_INSTRUCTION = `For each real headline given below (title, description, source), write exactly one sentence explaining why a procurement professional should care about it. Base the sentence only on the title and description given — never invent details, numbers, or outcomes not stated there.

Respond with one block per headline, in the same order given, in exactly this format (no extra commentary):
TITLE: <copy the headline title exactly as given>
WHY: <your one-sentence answer>`;

// Third, focused call: expand a single real headline into a structured
// deep dive, grounded only in that headline plus the real market snapshot
// already used for the rest of the brief.
export const DEEP_DIVE_INSTRUCTION = `Write a short structured deep dive on the single real headline given below, using only its title/description and the real market snapshot provided for context. Never invent specifics beyond what's given.

Respond in exactly this format:
WHAT HAPPENED: <1-2 sentences, restating the real headline's substance>
WHY IT MATTERS: <1-2 sentences on the procurement implication>
WHAT TO WATCH: <1-2 sentences — signals to monitor, never a prediction or forecast>
PROCUREMENT EXPOSURE: <1-2 sentences on which categories/regions are affected>`;
