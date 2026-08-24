import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const GEMINI_MODEL = 'gemini-flash-latest';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const DEFAULT_MAX_OUTPUT_TOKENS = 3072;
const RETRYABLE_STATUS = new Set([429, 500, 503]);
const MAX_ATTEMPTS = 4;

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class GeminiProvider {
  private readonly logger = new Logger(GeminiProvider.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.config.get<string>('GEMINI_API_KEY'));
  }

  async generate(systemInstruction: string, userMessage: string, maxOutputTokens = DEFAULT_MAX_OUTPUT_TOKENS): Promise<string> {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          // gemini-flash-latest spends part of maxOutputTokens on internal
          // "thinking" tokens before producing visible text — a low budget
          // here silently truncates the answer (finishReason MAX_TOKENS with
          // empty/partial text), so this needs real headroom.
          generationConfig: { temperature: 0.3, maxOutputTokens },
        }),
      });

      const body = (await response.json()) as GeminiResponse;

      if (!response.ok) {
        const message = body.error?.message ?? `Gemini request failed: ${response.status}`;
        // Gemini's free tier genuinely returns transient 429/500/503s under
        // load (observed repeatedly in practice) — worth a few backed-off
        // retries before giving up, rather than failing the whole brief/
        // story generation on a blip.
        if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_ATTEMPTS) {
          this.logger.warn(`Gemini ${response.status} on attempt ${attempt}/${MAX_ATTEMPTS}, retrying: ${message}`);
          lastError = new Error(message);
          await sleep(1500 * attempt);
          continue;
        }
        this.logger.warn(message);
        throw new Error(message);
      }

      if (body.promptFeedback?.blockReason) {
        throw new Error(`Response blocked: ${body.promptFeedback.blockReason}`);
      }

      const text = body.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('');
      if (!text) {
        throw new Error('Gemini returned an empty response');
      }

      return text;
    }

    throw lastError ?? new Error('Gemini request failed after retries');
  }
}
