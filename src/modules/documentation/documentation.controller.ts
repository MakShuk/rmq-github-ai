import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiInfoDto } from '../../dto/ai-question.dto';

@ApiTags('Documentation')
@Controller()
export class DocumentationController {
  @Get('info')
  @ApiOperation({
    summary: 'Получить информацию об API',
    description: 'Возвращает основную информацию о доступном API, включая версию, поддерживаемые модели и доступные эндпоинты',
    operationId: 'getApiInfo',
  })
  @ApiResponse({
    status: 200,
    description: 'Информация об API успешно получена',
    type: ApiInfoDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
  })
  getApiInfo(): ApiInfoDto {
    return {
      name: 'GitHub AI API',
      version: '1.0.0',
      description: 'API для взаимодействия с GitHub AI моделями. Позволяет отправлять вопросы к различным AI моделям и получать ответы в реальном времени.',
      baseUrl: process.env.API_BASE_URL || 'http://localhost:9811',
      endpoints: [
        {
          path: '/ai-question',
          method: 'POST',
          description: 'Отправить вопрос AI и получить ответ',
        },
        {
          path: '/health',
          method: 'GET',
          description: 'Проверить состояние системы и доступность сервисов',
        },
        {
          path: '/api/info',
          method: 'GET',
          description: 'Получить информацию об API',
        },
      ],
      supportedModels: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
    };
  }
}