# ---------------------
# СТАДИЯ 1: СБОРКА
# ---------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ---------------------
# СТАДИЯ 2: СЕРВИС СТАТИКИ
# ---------------------
FROM nginx:alpine

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем наш конфиг (заменяет дефолтный)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 3108 (соответствует конфигу)
EXPOSE 3108

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]