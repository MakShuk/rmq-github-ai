import { ChatCompletionsResponseFormat } from '@azure-rest/ai-inference';
import { IsString, IsOptional, IsObject } from 'class-validator';


export namespace AGSendQuestionAI {
    export const topic = "github-ai.send-question.queue";

    export class Request {
        @IsString()
        userMessage!: string;

        @IsString()
        @IsOptional()
        model?: string;

        @IsObject()
        @IsOptional()
        response_format?: ChatCompletionsResponseFormat;
    }

    export class Response {
        @IsString()
        botMessage!: string;
    }
}
