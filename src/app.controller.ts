import { Controller, } from '@nestjs/common';
import { AppService } from './app.service';
import { RMQRoute } from 'nestjs-rmq';
import { AGSendQuestionAI } from 'contracts/azure-github.contract';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService,) { }


    @RMQRoute(AGSendQuestionAI.topic)
    async getHello(data: AGSendQuestionAI.Request) {
        console.log(`${AGSendQuestionAI.topic}`, data.userMessage);
        try {
            return await this.appService.run(data.userMessage);
        } catch (error) {
            console.error('[getHello] Error processing request:', error);
            throw error;
        }
    }
}