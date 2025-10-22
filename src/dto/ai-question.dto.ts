import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { ChatCompletionsResponseFormat } from '@azure-rest/ai-inference';

/**
 * DTO для запроса к AI
 */
export class AIQuestionDto {
  @ApiProperty({
    description: 'Сообщение пользователя для обработки AI',
    example: 'Расскажи о преимуществах NestJS',
    minLength: 1,
    maxLength: 4000,
    type: String,
  })
  @IsString()
  userMessage!: string;

  @ApiPropertyOptional({
    description: 'Модель AI для обработки запроса',
    example: 'gpt-4o-mini',
    default: 'gpt-4o-mini',
    enum: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
    type: String,
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({
    description: 'Формат ответа от AI',
    example: { type: 'text' },
    default: { type: 'text' },
    type: Object,
  })
  @IsObject()
  @IsOptional()
  response_format?: ChatCompletionsResponseFormat;
}

/**
 * DTO для ответа от AI
 */
export class AIResponseDto {
  @ApiProperty({
    description: 'Ответ от AI',
    example: 'NestJS - это фреймворк для создания эффективных и масштабируемых серверных приложений на Node.js...',
    type: String,
  })
  @IsString()
  botMessage!: string;
}

/**
 * DTO для ошибки
 */
export class ErrorDto {
  @ApiProperty({
    description: 'Код ошибки',
    example: 'VALIDATION_ERROR',
    type: String,
  })
  code!: string;

  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Ошибка валидации входных данных',
    type: String,
  })
  message!: string;

  @ApiProperty({
    description: 'Детали ошибки',
    example: [{ field: 'userMessage', message: 'Поле userMessage обязательно для заполнения' }],
    type: Array,
    required: false,
  })
  details?: Array<{
    field: string;
    message: string;
  }>;

  @ApiProperty({
    description: 'Временная метка ошибки',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  timestamp!: string;

  @ApiProperty({
    description: 'Путь запроса',
    example: '/api/v1/ai-question',
    type: String,
  })
  path!: string;
}

/**
 * DTO для Health Check
 */
export class HealthCheckDto {
  @ApiProperty({
    description: 'Статус приложения',
    example: 'ok',
    enum: ['ok', 'error'],
    type: String,
  })
  status!: string;

  @ApiProperty({
    description: 'Информация о системе',
    type: Object,
    example: {
      uptime: 3600,
      timestamp: '2024-01-15T10:30:00.000Z',
      version: '1.0.0',
      environment: 'production',
    },
  })
  info!: {
    uptime: number;
    timestamp: string;
    version: string;
    environment: string;
  };

  @ApiProperty({
    description: 'Статусы внешних сервисов',
    type: Object,
    example: {
      azure_ai: { status: 'up', responseTime: 150 },
      database: { status: 'up', responseTime: 25 },
    },
  })
  details!: {
    [key: string]: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
  };
}

/**
 * DTO для информации о API
 */
export class ApiInfoDto {
  @ApiProperty({
    description: 'Название API',
    example: 'GitHub AI API',
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: 'Версия API',
    example: '1.0.0',
    type: String,
  })
  version!: string;

  @ApiProperty({
    description: 'Описание API',
    example: 'API для взаимодействия с GitHub AI моделями',
    type: String,
  })
  description!: string;

  @ApiProperty({
    description: 'Базовый URL',
    example: 'https://api.github-ai.com/v1',
    type: String,
  })
  baseUrl!: string;

  @ApiProperty({
    description: 'Доступные эндпоинты',
    type: Array,
    example: [
      {
        path: '/ai-question',
        method: 'POST',
        description: 'Отправить вопрос AI',
      },
      {
        path: '/health',
        method: 'GET',
        description: 'Проверка состояния системы',
      },
    ],
  })
  endpoints!: Array<{
    path: string;
    method: string;
    description: string;
  }>;

  @ApiProperty({
    description: 'Поддерживаемые модели',
    type: Array,
    example: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
  })
  supportedModels!: string[];
}