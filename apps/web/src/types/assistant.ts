export interface AskInput {
  question: string;
  conversationId?: string;
  currentContext?: Record<string, unknown>;
  profile?: Record<string, unknown>;
}

export interface AskResponse {
  answer: string;
  dataAsOf: string | null;
  model: string;
  conversationId: string;
}

export interface MarketStoryResponse {
  symbol: string;
  story: string;
  dataAsOf: string;
  generatedAt: string;
  model: string;
}
