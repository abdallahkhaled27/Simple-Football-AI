import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async getFootballAnswer(question: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a football analysis assistant.' },
        { role: 'user', content: question },
      ],
    });

    return response.choices[0].message.content || 'No answer generated.';
  }
}
