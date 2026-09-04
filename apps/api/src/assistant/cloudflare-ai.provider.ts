import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_CLOUDFLARE_MODEL = '@cf/meta/llama-3.2-3b-instruct';
const DEFAULT_MAX_OUTPUT_TOKENS = 1024;
const REQUEST_TIMEOUT_MS = 60_000;

interface CloudflareError {
  message?: string;
}

interface CloudflareAiResponse {
  success?: boolean;
  errors?: CloudflareError[];
  result?: {
    response?: string;
  };
}

/**
 * ProcureChain's replaceable hosted-model adapter.
 *
 * The rest of the application supplies its own verified market data and
 * procurement instructions. This class only sends that prepared context to
 * Cloudflare Workers AI and can be replaced without changing product logic.
 */
@Injectable()
export class CloudflareAiProvider {
  private readonly logger = new Logger(CloudflareAiProvider.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.accountId && this.apiToken);
  }

  get modelName(): string {
    return this.model;
  }

  publicConfigurationError(errorMessage: string): string {
    if (/auth|token|permission|unauthori[sz]ed/i.test(errorMessage)) {
      return 'Cloudflare Workers AI authentication failed. Create a new Workers AI API token with Workers AI Read and Edit permissions, add it to CLOUDFLARE_AI_API_TOKEN, then restart the API.';
    }

    return 'Cloudflare Workers AI could not generate a response. Check the Cloudflare account, token, model, and usage limits, then try again.';
  }

  async generate(
    systemInstruction: string,
    userMessage: string,
    maxOutputTokens = DEFAULT_MAX_OUTPUT_TOKENS,
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Cloudflare Workers AI is not configured');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response: Response;

    try {
      response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${this.model}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: userMessage },
            ],
            max_tokens: maxOutputTokens,
            temperature: 0.3,
          }),
        },
      );
    } catch (error) {
      const message = error instanceof Error && error.name === 'AbortError'
        ? `Cloudflare Workers AI request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds`
        : 'Could not reach Cloudflare Workers AI';
      this.logger.warn(message);
      throw new Error(message, { cause: error });
    } finally {
      clearTimeout(timeout);
    }

    let body: CloudflareAiResponse;
    try {
      body = (await response.json()) as CloudflareAiResponse;
    } catch (error) {
      throw new Error(`Cloudflare Workers AI returned an invalid response (${response.status})`, { cause: error });
    }

    if (!response.ok || !body.success) {
      const message = body.errors?.map((error) => error.message).filter(Boolean).join('; ')
        || `Cloudflare Workers AI request failed: ${response.status}`;
      this.logger.warn(message);
      throw new Error(message);
    }

    const text = body.result?.response?.trim();
    if (!text) {
      this.logger.error('Cloudflare Workers AI returned no response text');
      throw new Error('Cloudflare Workers AI returned an empty response');
    }

    return text;
  }

  private get accountId(): string | undefined {
    return this.config.get<string>('CLOUDFLARE_ACCOUNT_ID');
  }

  private get apiToken(): string | undefined {
    return this.config.get<string>('CLOUDFLARE_AI_API_TOKEN');
  }

  private get model(): string {
    return this.config.get<string>('CLOUDFLARE_AI_MODEL') ?? DEFAULT_CLOUDFLARE_MODEL;
  }
}
