import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('football-chat')
  async footballChat(@Body() body: { question: string }) {
    const answer = await this.aiService.getFootballAnswer(body.question);
    return { answer };
  }
}
