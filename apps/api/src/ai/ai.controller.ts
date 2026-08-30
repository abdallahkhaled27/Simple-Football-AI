import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { FootballChatDto } from './dto/football-chat.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('football-chat')
  async footballChat(@Body() body: FootballChatDto) {
    const question = body?.question?.trim();

    if (!question) {
      throw new BadRequestException('question must be a non-empty string');
    }

    const answer = await this.aiService.getFootballAnswer(question);
    return { answer };
  }
}
