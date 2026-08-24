export interface HealthCheckAnswerOption {
  key: 'A' | 'B' | 'C' | 'D';
  label: string;
}

export interface HealthCheckQuestion {
  id: string;
  text: string;
  answers: HealthCheckAnswerOption[];
}

export interface DimensionResult {
  key: string;
  label: string;
  score: number;
  opportunity: number;
}

export interface DimensionOpportunity extends DimensionResult {
  opportunityLabel: string;
  actions: string[];
  links: Array<{ label: string; href: string }>;
}

export interface HealthCheckScoreResult {
  overallScore: number;
  maturity: { key: string; label: string; description: string };
  dimensions: DimensionResult[];
  topOpportunities: DimensionOpportunity[];
}

export interface HealthCheckLeadInput {
  firstName: string;
  lastName?: string;
  email: string;
  company?: string;
  jobTitle?: string;
  country?: string;
  industry?: string;
}

export interface SubmitHealthCheckInput {
  answers: Record<string, string>;
  lead: HealthCheckLeadInput;
  sessionId?: string;
}
