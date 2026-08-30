import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import OpenAI from 'openai';
import { LiveFootballContextService } from './live-football-context.service';

const FOOTBALL_SYSTEM_PROMPT = `You are Football Brain, an expert football analyst.

Answer the user's actual question directly in clear, natural football language. Avoid generic introductions and biographies unless requested.

Analysis standards:
- Be tactically precise. When relevant, discuss positioning, player roles, formations, buildup, pressing triggers, defensive blocks, midfield overloads, width, half-spaces, rest defense, transitions, chance creation, and possible adjustments.
- For players, focus on current role and level when verified, technical and physical qualities, tactical usage, strengths, weaknesses, and evolution.
- For comparisons, compare role, technical ability, chance creation, finishing, progression, defensive contribution, tactical fit, strengths, and weaknesses as relevant. Do not force a winner without a stated criterion.
- Distinguish verified facts from analysis or opinion. Never invent statistics, results, injuries, transfers, quotes, lineups, or dates.
- Treat words such as "now", "currently", "latest", "recent", "today", and "this season" relative to the supplied current date.
- If live context is supplied, prioritize it over pretrained knowledge for current facts. Attribute time-sensitive claims concisely using the source names or links included in that context.
- If current facts were required but could not be verified, say so plainly. Do not replace missing facts with guesses; still provide useful non-time-sensitive analysis where possible.
- Keep simple answers concise. Use short headings or bullets only when comparison or deeper analysis benefits from structure.`;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(private readonly liveContextService: LiveFootballContextService) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is required in apps/api/.env for the Football AI endpoint',
      );
    }

    this.model = process.env.AI_MODEL || 'gpt-5.4';
    this.client = new OpenAI({ apiKey });
  }

  async getFootballAnswer(question: string): Promise<string> {
    const currentDate = new Date().toISOString().slice(0, 10);
    const liveContext = await this.liveContextService.getContext(
      question,
      currentDate,
    );

    const contextBlock = liveContext.required
      ? liveContext.context
        ? `LIVE CONTEXT (retrieved for this question):\n${liveContext.context}`
        : 'LIVE CONTEXT: Current information was required but could not be verified. Explicitly disclose this limitation.'
      : 'LIVE CONTEXT: Not required for this non-time-sensitive question.';

    try {
      const response = await this.client.responses.create({
        model: this.model,
        instructions: FOOTBALL_SYSTEM_PROMPT,
        input: `CURRENT DATE: ${currentDate}\n\n${contextBlock}\n\nUSER QUESTION:\n${question}`,
        store: false,
      });

      const answer = response.output_text?.trim();

      if (!answer) {
        throw new InternalServerErrorException(
          'The AI provider returned no answer.',
        );
      }

      return answer;
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      this.logger.error(
        `Football answer generation failed using model ${this.model}: ${this.errorMessage(error)}`,
      );
      throw new InternalServerErrorException(
        'The football AI provider could not generate an answer.',
      );
    }
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown provider error';
  }
}
