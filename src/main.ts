import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { AllExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // Включаем безопасность
  app.use(helmet());
  app.use(compression());

  // Включаем CORS с более гибкими настройками для Swagger
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      // Разрешаем все источники для разработки
      process.env.NODE_ENV === 'development' ? /.*/ : false
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  });

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Глобальный фильтр исключений
  app.useGlobalFilters(new AllExceptionsFilter());

  // Префикс для всех маршрутов
  app.setGlobalPrefix('api/v1');

  // Конфигурация Swagger
  const config = new DocumentBuilder()
    .setTitle('GitHub AI API')
    .setDescription(`
    ## GitHub AI API Documentation

    Это API предоставляет возможность взаимодействия с различными AI моделями от GitHub.

    ### Возможности:
    - Отправка вопросов к AI моделям
    - Получение ответов в реальном времени
    - Поддержка различных моделей (GPT-4o-mini, GPT-4o, GPT-3.5-turbo)
    - Настройка формата ответа
    - Health check для мониторинга состояния системы

    ### Аутентификация:
    Для использования API требуется GitHub токен, который должен быть передан в переменных окружения.

    ### Rate Limiting:
    API имеет ограничения на количество запросов в минуту для обеспечения стабильной работы.

    ### Версионирование:
    Текущая версия API: 1.0.0
    Версионирование осуществляется через URL путь: /api/v1/

    ### Поддержка:
    По всем вопросам обращайтесь: support@github-ai.com
    `)
    .setVersion('1.0.0')
    .setContact(
      'GitHub AI Support',
      'https://github-ai.com/support',
      'support@github-ai.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:9811', 'Development server')
    .addServer('http://127.0.0.1:9811', 'Development server (localhost)')
    .addServer('https://staging-api.github-ai.com', 'Staging server')
    .addServer('https://api.github-ai.com', 'Production server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT токен для аутентификации',
        in: 'header',
      },
      'JWT-auth'
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'Введите API ключ для аутентификации',
      },
      'ApiKey-auth'
    )
    .addTag('AI', 'Эндпоинты для работы с AI моделями')
    .addTag('Health', 'Эндпоинты для проверки состояния системы')
    .addTag('Documentation', 'Информационные эндпоинты')
    .setExternalDoc('GitHub Repository', 'https://github.com/your-org/github-ai')
    .setExternalDoc('Postman Collection', 'https://api.github-ai.com/postman')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
    extraModels: [],
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'GitHub AI API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .topbar-wrapper img { content: url('https://github.com/github.png'); width: 50px; height: auto; }
      .swagger-ui .topbar { background-color: #24292e; }
      .swagger-ui .topbar-wrapper .link { color: #ffffff; }
      .swagger-ui .info .title { color: #24292e; }
    `,
    customJs: '',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      tryItOutEnabled: true,
      // Добавляем поддержку CORS для запросов из Swagger UI
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
      requestInterceptor: (request: any) => {
        // Добавляем заголовки для CORS если нужно
        return request;
      },
      responseInterceptor: (response: any) => {
        return response;
      }
    },
  });

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
  console.log(`🔍 Health check available at: http://localhost:${port}/api/v1/health`);
}

bootstrap();
