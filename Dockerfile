# Этап сборки
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./


# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап production
FROM node:18-alpine AS production

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production

# Копируем собранное приложение из этапа сборки
COPY --from=builder /app/dist ./dist

# Копируем env файлы
COPY envs/.env.* ./envs/


# Запускаем приложение
CMD ["npm", "run", "start:prod"] 