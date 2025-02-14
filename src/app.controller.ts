import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { RMQRoute } from 'nestjs-rmq';
import { AGSendQuestionAI } from './contracts/azure-github.contract';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @RMQRoute(AGSendQuestionAI.topic)
    async processAIQuestion(data: AGSendQuestionAI.Request): Promise<AGSendQuestionAI.Response> {
        console.log({ data });
        console.log(`${AGSendQuestionAI.topic}`, data.userMessage);
        try {
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