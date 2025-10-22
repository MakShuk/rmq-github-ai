import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyAuth } from '../decorators/api-key.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isApiKeyRequired = this.reflector.get<boolean>(
      ApiKeyAuth,
      context.getHandler(),
    );

    if (!isApiKeyRequired) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'] || request.query.api_key;

    // В реальном приложении здесь должна быть проверка API ключа
    // Для демонстрации принимаем любой ключ
    if (!apiKey) {
      return false;
    }

    // Здесь можно добавить проверку ключа в базе данных
    // или сравнение с константой из конфигурации
    return true;
  }
}