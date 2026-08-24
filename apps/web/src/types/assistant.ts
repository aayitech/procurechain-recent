export interface AskInput {
  question: string;
}

export interface AskResponse {
  answer: string;
  dataAsOf: string | null;
  model: string;
}

export interface MarketStoryResponse {
  symbol: string;
  story: string;
  dataAsOf: string;
  generatedAt: string;
  model: string;
}
