import { IsString, } from 'class-validator';


export namespace AGSendQuestionAI {
    export const topic = "github-ai.send-question.queue";

    export class Request {
        @IsString()
        //@ts-ignore
        userMessage: string;
    }

    export class Response {
        @IsString()
        //@ts-ignore
        botMessage: string;
    }
}
