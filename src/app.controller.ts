import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AGSendQuestionAI } from './contracts/azure-github.contract';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Post('ai-question')
    async processAIQuestion(@Body() data: AGSendQuestionAI.Request): Promise<AGSendQuestionAI.Response> {
        try {
            console.log({ data });

            const botMessage = await this.appService.run(data.userMessage, {
                model: data.model,
                response_format: data.response_format
            });
            return { botMessage };
        } catch (error) {
            console.error('[processAIQuestion] Error processing request:', error);
            throw error;
        }
    }
}