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

Проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE).