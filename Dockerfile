# СТАДИЯ 1: СБОРКА ПРИЛОЖЕНИЯ
FROM node:22-alpine AS builder

WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Копируем исходники и собираем проект
COPY . .
RUN npm run build

# СТАДИЯ 2: СЕРВИС СТАТИКИ (Nginx)
FROM nginx:alpine

# Создаём конфиг Nginx для SPA (React Router) прямо внутри образа
RUN echo 'server { \
    listen 3108; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Копируем собранные файлы из первого этапа
COPY --from=builder /app/dist /usr/share/nginx/html

# Открываем порт 3108
EXPOSE 3108

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]