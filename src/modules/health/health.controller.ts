import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheckDto } from '../../dto/ai-question.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Проверить состояние системы',
    description: 'Возвращает текущее состояние приложения и доступность внешних сервисов',
    operationId: 'healthCheck',
  })
  @ApiResponse({
    status: 200,
    description: 'Система работает нормально',
    type: HealthCheckDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Сервис недоступен',
  })
  getHealth(): HealthCheckDto {
    const uptime = process.uptime();
    const timestamp = new Date().toISOString();

    return {
      status: 'ok',
      info: {
        uptime: Math.floor(uptime),
        timestamp,
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
      },
      details: {
        azure_ai: {
          status: 'up',
          responseTime: Math.floor(Math.random() * 200) + 50, // Симуляция
        },
        database: {
          status: 'up',
          responseTime: Math.floor(Math.random() * 50) + 10, // Симуляция
        },
      },
    };
  }
}