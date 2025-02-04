# Github AI Service

Сервис для интеграции GitHub с Azure AI, построенный на NestJS фреймворке.

## 🛠 Технологический стек

- **Backend:** NestJS (v10)
- **Message Broker:** RabbitMQ
- **AI Integration:** Azure AI Services
- **Конфигурация:** Docker & Docker Compose
- **Документация API:** Swagger

## 📋 Предварительные требования

- Node.js (LTS версия)
- Docker и Docker Compose
- RabbitMQ (через Docker network)

## 🚀 Установка и запуск

1. **Клонирование репозитория**
```bash
git clone [repository-url]
cd github-ai
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Настройка переменных окружения**
- Создайте файлы в директории `envs/`:
  - `.env.development` для разработки
  - `.env.production` для продакшена

4. **Запуск в режиме разработки**
```bash
npm run start:dev
```

5. **Запуск через Docker**
```bash
docker-compose up -d
```

## 💻 Доступные скрипты

- `npm run build` - сборка проекта
- `npm run start` - запуск в продакшен режиме
- `npm run start:dev` - запуск с hot-reload
- `npm run start:debug` - запуск в режиме отладки
- `npm run lint` - проверка кода линтером
- `npm run format` - форматирование кода

## 🏗 Архитектура

Сервис использует микросервисную архитектуру с RabbitMQ для обмена сообщениями. Основные компоненты:

- **API Layer** - REST endpoints
- **Message Queue** - Обработка асинхронных запросов через RabbitMQ
- **Azure AI Integration** - Взаимодействие с Azure AI services

## 🔄 Очереди RabbitMQ

Основная очередь:
- `github-ai.send-question.queue` - обработка запросов к AI

## 🐳 Docker

Проект содержит полную Docker-конфигурацию:
- Dockerfile для сборки образа приложения
- Docker Compose для оркестрации сервисов
- Настроенная сеть для взаимодействия с RabbitMQ

## 👨‍💻 Автор

Maksim Shuklin

## 📄 Лицензия

MIT License

Copyright (c) 2024 Maksim Shuklin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.