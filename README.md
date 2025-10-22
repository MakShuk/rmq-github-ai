# GitHub AI API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

RESTful API для взаимодействия с GitHub AI моделями. Позволяет отправлять вопросы к различным AI моделям и получать ответы в реальном времени.

## 🚀 Возможности

- **Множественные AI модели**: Поддержка GPT-4o-mini, GPT-4o, GPT-3.5-turbo
- **Гибкие форматы ответа**: Текстовый и JSON формат
- **Аутентификация**: Поддержка JWT и API ключей
- **Rate Limiting**: Защита от перегрузки
- **Валидация**: Полная валидация входных данных
- **Интерактивная документация**: Swagger UI с примерами
- **Health Check**: Мониторинг состояния системы
- **Обработка ошибок**: Стандартизированные ответы об ошибках

## 📋 Содержание

- [Установка и запуск](#-установка-и-запуск)
- [Документация API](#-документация-api)
- [Аутентификация](#-аутентификация)
- [Эндпоинты](#-эндпоинты)
- [Примеры кода](#-примеры-кода)
- [Обработка ошибок](#-обработка-ошибок)
- [Rate Limiting](#-rate-limiting)
- [Модели](#-модели)
- [Разработка](#-разработка)
- [Лицензия](#-лицензия)

## 🛠️ Установка и запуск

### Требования

- Node.js >= 18.0.0
- npm >= 8.0.0

### Установка зависимостей

```bash
npm install
```

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Порт приложения
PORT=3000

# Окружение
NODE_ENV=development

# GitHub токен (обязательно)
GITHUB_TOKEN=your_github_token_here

# Базовый URL API (опционально)
API_BASE_URL=http://localhost:3000
```

### Запуск

```bash
# Разработка
npm run start:dev

# Продакшн
npm run build
npm run start:prod
```

### Docker

```bash
# Сборка
docker build -t github-ai-api .

# Запуск
docker run -p 3000:3000 --env-file .env github-ai-api
```

## 📚 Документация API

После запуска приложения документация доступна по адресу:

- **Swagger UI**: http://localhost:3000/api/docs
- **JSON спецификация**: http://localhost:3000/api/docs-json

### Возможности Swagger UI

- Интерактивное тестирование эндпоинтов
- Автоматическая генерация примеров
- Поддержка аутентификации
- Детальное описание параметров
- Примеры ответов для всех кодов статуса

## 🔐 Аутентификация

API поддерживает два метода аутентификации:

### 1. JWT Bearer Token

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### 2. API Key

```http
X-API-Key: YOUR_API_KEY
```

### Получение токенов

Для использования API требуется GitHub токен, который должен быть указан в переменных окружения `GITHUB_TOKEN`.

## 🎯 Эндпоинты

### Health Check

Проверка состояния системы и доступности внешних сервисов.

```http
GET /api/v1/health
```

**Ответ:**
```json
{
  "status": "ok",
  "info": {
    "uptime": 3600,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "version": "1.0.0",
    "environment": "production"
  },
  "details": {
    "azure_ai": {
      "status": "up",
      "responseTime": 150
    },
    "database": {
      "status": "up",
      "responseTime": 25
    }
  }
}
```

### Информация об API

Получение базовой информации о API и доступных возможностях.

```http
GET /api/v1/api/info
```

**Ответ:**
```json
{
  "name": "GitHub AI API",
  "version": "1.0.0",
  "description": "API для взаимодействия с GitHub AI моделями",
  "baseUrl": "https://api.github-ai.com",
  "endpoints": [
    {
      "path": "/ai-question",
      "method": "POST",
      "description": "Отправить вопрос AI"
    }
  ],
  "supportedModels": ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"]
}
```

### Вопрос к AI

Основной эндпоинт для отправки вопросов AI модели.

```http
POST /api/v1/ai-question
```

**Тело запроса:**
```json
{
  "userMessage": "Расскажи о преимуществах NestJS",
  "model": "gpt-4o-mini",
  "response_format": {
    "type": "text"
  }
}
```

**Ответ:**
```json
{
  "botMessage": "NestJS - это прогрессивный фреймворк для создания эффективных серверных приложений..."
}
```

## 💻 Примеры кода

### cURL

```bash
# Базовый запрос
curl -X POST "http://localhost:3000/api/v1/ai-question" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userMessage": "Расскажи о преимуществах NestJS",
    "model": "gpt-4o-mini"
  }'
```

### JavaScript/TypeScript

```javascript
// Базовый запрос
async function sendAIQuestion() {
  const response = await fetch('http://localhost:3000/api/v1/ai-question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify({
      userMessage: 'Расскажи о преимуществах NestJS',
      model: 'gpt-4o-mini'
    })
  });

  const result = await response.json();
  console.log('Ответ AI:', result.botMessage);
}

sendAIQuestion();
```

### Python

```python
import requests

def ask_ai_question():
    url = "http://localhost:3000/api/v1/ai-question"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_JWT_TOKEN"
    }
    data = {
        "userMessage": "Расскажи о преимуществах Python",
        "model": "gpt-4o-mini"
    }

    response = requests.post(url, headers=headers, json=data)
    result = response.json()
    print(f"Ответ AI: {result['botMessage']}")

ask_ai_question()
```

Больше примеров кода доступно в [src/examples/code-examples.ts](src/examples/code-examples.ts)

## ⚠️ Обработка ошибок

API возвращает стандартизированные ошибки в следующем формате:

```json
{
  "code": "ERROR_CODE",
  "message": "Описание ошибки",
  "details": [
    {
      "field": "userMessage",
      "message": "Поле обязательно для заполнения"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/ai-question"
}
```

### Коды ошибок

| Код | HTTP Статус | Описание |
|-----|-------------|----------|
| `BAD_REQUEST` | 400 | Ошибка валидации входных данных |
| `UNAUTHORIZED` | 401 | Требуется аутентификация |
| `FORBIDDEN` | 403 | Недостаточно прав |
| `NOT_FOUND` | 404 | Ресурс не найден |
| `TOO_MANY_REQUESTS` | 429 | Превышен лимит запросов |
| `INTERNAL_SERVER_ERROR` | 500 | Внутренняя ошибка сервера |

## 🚦 Rate Limiting

API применяет ограничения для обеспечения стабильной работы:

- **Лимит**: 60 запросов в минуту
- **Окно**: 1 минута
- **Ответ при превышении**: HTTP 429 с заголовком `Retry-After`

```json
{
  "code": "TOO_MANY_REQUESTS",
  "message": "Превышен лимит запросов. Попробуйте позже.",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/ai-question"
}
```

## 🤖 Модели

### Доступные модели

| Модель | Описание | Использование |
|--------|----------|---------------|
| `gpt-4o-mini` | Быстрая и экономичная модель | Рекомендуется для большинства задач |
| `gpt-4o` | Мощная модель для сложных задач | Анализ, креативные задачи |
| `gpt-3.5-turbo` | Базовая модель | Простые запросы |

### Форматы ответа

- `text` (по умолчанию) - обычный текстовый ответ
- `json_object` - структурированный ответ в формате JSON

### Ограничения

- Максимальная длина сообщения: 4000 символов
- Таймаут запроса: 30 секунд
- Максимальный размер ответа: 4000 символов

## 🛠️ Разработка

### Структура проекта

```
src/
├── app.controller.ts           # Основной контроллер
├── app.service.ts              # Бизнес-логика
├── app.module.ts               # Корневой модуль
├── main.ts                     # Точка входа
├── dto/                        # DTO классы
├── modules/                    # Модули функциональности
│   ├── documentation/          # Документация
│   └── health/                 # Health check
├── guards/                     # Guards (аутентификация)
├── filters/                    # Фильтры исключений
├── decorators/                 # Кастомные декораторы
└── examples/                   # Примеры кода
```

### Скрипты

```bash
# Разработка
npm run start:dev

# Сборка
npm run build

# Линтинг
npm run lint

# Форматирование
npm run format
```

### Тестирование

```bash
# Запуск тестов
npm test

# Тесты с покрытием
npm run test:cov
```

### Линтинг и форматирование

Проект использует ESLint и Prettier для поддержания кода в чистоте:

```bash
# Проверка и исправление
npm run lint

# Форматирование кода
npm run format
```

## 📝 Версионирование

API следует семантическому версионированию (MAJOR.MINOR.PATCH):

- **MAJOR**: Критические изменения, несовместимые с предыдущими версиями
- **MINOR**: Новые функциональности, обратная совместимость сохраняется
- **PATCH**: Исправления ошибок, обратная совместимость сохраняется

Текущая версия: **1.0.0**

### Версионирование через URL

Все эндпоинты включают версию в URL: `/api/v1/`

## 🔄 CI/CD

Проект настроен для автоматической сборки и развертывания:

- **Валидация** при каждом коммите
- **Тестирование** в CI/CD pipeline
- **Автоматический деплой** после слияния в main
- **Генерация документации** при сборке

## 📞 Поддержка

По всем вопросам и предложениям:

- **Email**: support@github-ai.com
- **GitHub Issues**: [Создать issue](https://github.com/your-org/github-ai/issues)
- **Документация**: http://localhost:3000/api/docs

## 📄 Лицензия

Проект распространяется под лицензией [MIT](LICENSE).

---

## 🤝 Contributing

Вклад в проект приветствуется! Пожалуйста, ознакомьтесь с [CONTRIBUTING.md](CONTRIBUTING.md) перед созданием pull request.

### Правила для контрибьюторов

1. Создайте ветку от `develop`
2. Следуйте правилам кодирования проекта
3. Добавьте тесты для новой функциональности
4. Обновите документацию
5. Создайте pull request с описанием изменений

---

**Спасибо за использование GitHub AI API!** 🚀