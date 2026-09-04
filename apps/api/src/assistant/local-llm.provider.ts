import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
const DEFAULT_OLLAMA_MODEL = 'qwen3:1.7b';
const DEFAULT_MAX_OUTPUT_TOKENS = 1024;
// A local CPU model needs more time than a hosted API for longer reports.
// Individual features still keep their output budgets deliberately small.
const REQUEST_TIMEOUT_MS = 180_000;

interface OllamaChatResponse {
  message?: {
    role?: string;
    content?: string;
  };
  done?: boolean;
  error?: string;
}

@Injectable()
export class LocalLlmProvider {
  private readonly logger = new Logger(LocalLlmProvider.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.baseUrl && this.model);
  }

  get modelName(): string {
    return this.model;
  }

  async generate(
    systemInstruction: string,
    userMessage: string,
    maxOutputTokens = DEFAULT_MAX_OUTPUT_TOKENS,
  ): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          stream: false,
          think: false,
          messages: [
            // Some Qwen3/Ollama combinations ignore the API `think: false`
            // flag. The model-level command prevents it from spending minutes
            // emitting hidden reasoning before the actual answer.
            { role: 'system', content: `/no_think\n\n${systemInstruction}` },
            { role: 'user', content: userMessage },
          ],
          options: { temperature: 0.3, num_predict: maxOutputTokens },
        }),
      });
    } catch (error) {
      const message = error instanceof Error && error.name === 'AbortError'
        ? `Ollama request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds`
        : `Could not reach Ollama at ${this.baseUrl}`;
      this.logger.warn(message);
      throw new Error(message, { cause: error });
    } finally {
      clearTimeout(timeout);
    }

    let body: OllamaChatResponse;
    try {
      body = (await response.json()) as OllamaChatResponse;
    } catch (error) {
      throw new Error(`Ollama returned an invalid response (${response.status})`, { cause: error });
    }

    if (!response.ok) {
      const message =
        body.error ?? `Ollama request failed: ${response.status}`;

      this.logger.warn(message);
      throw new Error(message);
    }

    if (body.error) {
      this.logger.warn(body.error);
      throw new Error(body.error);
    }

    const text = body.message?.content?.trim();

    if (!text) {
      this.logger.error('Ollama returned no message content');
      throw new Error('Ollama returned an empty response');
    }

    return text;
  }

  private get baseUrl(): string {
    return (this.config.get<string>('OLLAMA_URL') ?? DEFAULT_OLLAMA_URL).replace(/\/$/, '');
  }

  private get model(): string {
    return this.config.get<string>('OLLAMA_MODEL') ?? DEFAULT_OLLAMA_MODEL;
  }
}
