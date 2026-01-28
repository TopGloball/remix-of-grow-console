# Диагностика 502 после замены на serve

## SHA коммита для проверки

**Ожидаемый SHA в Railway Deployment**: `bf6d7e1`

**Полный SHA**: `bf6d7e1` (можно проверить через `git rev-parse bf6d7e1`)

**Коммит**: `Fix Railway deployment: replace nginx with serve on $PORT`

## Что проверить в Railway Dashboard

### 1. Проверка Deployment

1. Откройте проект в Railway Dashboard
2. Найдите сервис `loyal-youth` (или frontend сервис)
3. Перейдите на вкладку **Deployments**
4. Найдите последний деплой с коммитом `bf6d7e1`
5. **Проверьте SHA коммита** - должен совпадать с `bf6d7e1`

### 2. Проверка Deploy Logs (НЕ Build Logs)

1. В том же деплое откройте вкладку **Deploy Logs** (не Build Logs!)
2. Прокрутите до конца логов
3. Ищите строки типа:
   - `Serving! / Accepting connections at http://...`
   - `Listening on port...`
   - Или ошибки: `No such file or directory`, `dist not found`, `command not found`

**Нужны последние 10-20 строк из Deploy Logs**

### 3. Проверка Settings сервиса

1. Откройте **Settings** сервиса
2. Проверьте **Start Command** / **Entrypoint**:
   - Должен быть пустым (чтобы использовался CMD из Dockerfile)
   - Или должен быть: `sh -c "serve -s dist -l $PORT"`
3. Проверьте **Healthcheck path**:
   - Должен быть `/` или отключен
   - Не должен быть `/health` или другой путь

### 4. Проверка переменных окружения

1. В **Settings** → **Variables**
2. Проверьте, что `PORT` установлен автоматически Railway (не нужно добавлять вручную)

## Ожидаемое поведение

После успешного деплоя в Deploy Logs должно быть:

```
> serve@14.2.1 start
> serve -s dist -l 3000

   ┌─────────────────────────────────────────┐
   │                                         │
   │   Serving!                              │
   │                                         │
   │   - Local:    http://localhost:3000     │
   │   - Network:  http://0.0.0.0:3000      │
   │                                         │
   │   Copied local address to clipboard!    │
   │                                         │
   └─────────────────────────────────────────┘
```

Или с переменной PORT:

```
Serving! / Accepting connections at http://[::]:$PORT
```

## Возможные проблемы

1. **Deploy Logs пустые** → Деплой не перешёл в run-фазу
   - Проверьте Build Logs на ошибки сборки
   - Проверьте, что SHA коммита совпадает

2. **Ошибка "dist not found"** → Проблема с копированием файлов из builder stage

3. **Ошибка "command not found: serve"** → Проблема с установкой serve

4. **Ошибка "PORT not set"** → Railway не установил переменную PORT

## Текущий Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
ENV PORT=3000
CMD ["sh", "-c", "serve -s dist -l $PORT"]
```
