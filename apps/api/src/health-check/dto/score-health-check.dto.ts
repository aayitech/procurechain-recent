import { IsIn, IsObject } from 'class-validator';

export class ScoreHealthCheckDto {
  @IsObject()
  answers!: Record<string, string>;
}

export const ANSWER_KEYS = ['A', 'B', 'C', 'D'] as const;

export function isValidAnswerKey(value: unknown): value is 'A' | 'B' | 'C' | 'D' {
  return typeof value === 'string' && (ANSWER_KEYS as readonly string[]).includes(value);
}
