import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AGSendQuestionAI } from './contracts/azure-github.contract';
import { AIQuestionDto, AIResponseDto, ErrorDto } from './dto/ai-question.dto';

@ApiTags('AI')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Post('ai-question')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Отправить вопрос AI',
        description: `
        Отправляет вопрос выбранной AI модели и возвращает сгенерированный ответ.

        **Поддерживаемые модели:**
        - gpt-4o-mini (по умолчанию) - быстрая и экономичная модель
        - gpt-4o - мощная модель для сложных задач
        - gpt-3.5-turbo - базовая модель для простых запросов

        **Форматы ответа:**
        - text (по умолчанию) - обычный текстовый ответ
        - json_object - ответ в формате JSON

        **Ограничения:**
        - Максимальная длина сообщения: 4000 символов
        - Rate limiting: 60 запросов в минуту
        `,
        operationId: 'sendAIQuestion',
    })
    @ApiBody({
        type: AIQuestionDto,
        description: 'Данные для отправки вопроса AI',
        examples: {
            simpleQuestion: {
                summary: 'Простой вопрос',
                value: {
                    userMessage: 'Расскажи о преимуществах NestJS',
                    model: 'gpt-4o-mini',
                },
            },
            complexQuestion: {
                summary: 'Сложный вопрос с JSON ответом',
                value: {
                    userMessage: 'Создай JSON структуру для пользователя с полями name, email, age',
                    model: 'gpt-4o',
                    response_format: { type: 'json_object' },
                },
            },
        },
    })
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({
        status: 200,
        description: 'Успешный ответ от AI',
        type: AIResponseDto,
        example: {
            botMessage: 'NestJS - это прогрессивный фреймворк для создания эффективных и масштабируемых серверных приложений на Node.js...',
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Ошибка валидации входных данных',
        type: ErrorDto,
        example: {
            code: 'VALIDATION_ERROR',
            message: 'Ошибка валидации входных данных',
            details: [
                {
                    field: 'userMessage',
                    message: 'Поле userMessage обязательно для заполнения',
                },
            ],
            timestamp: '2024-01-15T10:30:00.000Z',
            path: '/api/v1/ai-question',
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Ошибка аутентификации',
        type: ErrorDto,
        example: {
            code: 'UNAUTHORIZED',
            message: 'Требуется аутентификация',
            timestamp: '2024-01-15T10:30:00.000Z',
            path: '/api/v1/ai-question',
        },
    })
    @ApiResponse({
        status: 429,
        description: 'Превышен лимит запросов',
        type: ErrorDto,
        example: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Превышен лимит запросов. Попробуйте позже.',
            timestamp: '2024-01-15T10:30:00.000Z',
            path: '/api/v1/ai-question',
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Внутренняя ошибка сервера',
        type: ErrorDto,
        example: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Внутренняя ошибка при обработке запроса',
            timestamp: '2024-01-15T10:30:00.000Z',
            path: '/api/v1/ai-question',
        },
    })
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