import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

export type LiveFootballContext = {
  required: boolean;
  context: string | null;
};

const FRESHNESS_PATTERNS = [
  /\b(today|tonight|yesterday|tomorrow|now|currently|current|latest|recent|recently|live|breaking|update|updated)\b/i,
  /\b(this|last|next)\s+(match|game|week|season|round|window|month|year)\b/i,
  /\b(form|injur(?:y|ies|ed)|suspension|transfer|rumou?r|signing|table|standings|fixture|result|score|lineup|squad|top scorer)\b/i,
  /\b(stats?|statistics|goals?|assists?|minutes|appearances?|clean sheets?|xg|xa)\b.*\b(this|current|latest|season|year)\b/i,
  /\b(who is|who's|how is|how's|where is|where's|what is|what's)\b.*\b(playing|doing|leading|top|manager|coach)\b/i,
  /^\s*(how is|how's)\b/i,
];

export function requiresLiveFootballContext(question: string): boolean {
  return FRESHNESS_PATTERNS.some((pattern) => pattern.test(question));
}

@Injectable()
export class LiveFootballContextService {
  private readonly logger = new Logger(LiveFootballContextService.name);
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly enabled: boolean;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required for live football context');
    }

    this.client = new OpenAI({ apiKey });
    this.model =
      process.env.LIVE_SEARCH_MODEL || process.env.AI_MODEL || 'gpt-5.4';
    this.enabled = process.env.LIVE_SEARCH_ENABLED !== 'false';
  }

  async getContext(
    question: string,
    currentDate: string,
  ): Promise<LiveFootballContext> {
    const required = requiresLiveFootballContext(question);

    if (!required || !this.enabled) {
      return { required, context: null };
    }

    try {
      const response = await this.client.responses.create({
        model: this.model,
        instructions: `Find reliable, current football facts needed to answer the question. Today is ${currentDate}.
Prioritize official club, league, competition, federation, and reputable sports reporting sources. Cross-check claims when practical.
Return a compact factual briefing with dates, source names, and source URLs. Do not analyze the player or tactics and do not invent missing facts.`,
        input: question,
        tools: [{ type: 'web_search_preview' }],
        tool_choice: 'required',
        store: false,
      });

      return {
        required: true,
        context: response.output_text?.trim() || null,
      };
    } catch (error: unknown) {
      this.logger.warn(
        `Live football context lookup failed using model ${this.model}: ${this.errorMessage(error)}`,
      );
      return { required: true, context: null };
    }
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown provider error';
  }
}
