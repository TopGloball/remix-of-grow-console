# Статус переключения на старый backend

## Выполнено

1. ✅ Создан публичный домен для старого backend:
   - URL: `https://grow-platform-backend-prod-production.up.railway.app`
   - Команда: `railway domain --service grow-platform-backend-prod`

2. ✅ Попытка запустить старый backend:
   - Команда: `railway up --service grow-platform-backend-prod`
   - Результат: Деплой запущен, но упал (CRASHED)

## Проблемы

### Старый backend не запускается

**Service**: `grow-platform-backend-prod`

**Статус**: CRASHED

**Проблема**: Деплой упал, сервис не работает

**Нужно проверить**:
- Логи деплоя (Build Logs и Deploy Logs)
- Настройки сервиса (источник деплоя, Dockerfile, переменные окружения)
- Возможно сервис деплоится из другого репозитория или требует других настроек

## Текущее состояние

### Frontend (loyal-youth)
- **VITE_API_BASE_URL**: `https://backend-production-2f72.up.railway.app` (новый backend с ошибкой компиляции)
- **Статус**: Работает, но backend недоступен (502)

### Новый backend (backend)
- **URL**: `https://backend-production-2f72.up.railway.app`
- **Статус**: Не работает (502) - ошибка компиляции TypeScript (`@grow/core` не найден)

### Старый backend (grow-platform-backend-prod)
- **URL**: `https://grow-platform-backend-prod-production.up.railway.app`
- **Статус**: Не работает (404/502) - деплой упал (CRASHED)

## Следующие шаги

1. **Диагностировать проблему старого backend**:
   - Проверить логи деплоя в Railway Dashboard
   - Проверить настройки сервиса (источник, Dockerfile, переменные)
   - Возможно нужно указать правильный репозиторий/ветку для деплоя

2. **После исправления старого backend**:
   - Обновить `VITE_API_BASE_URL` в Railway Dashboard для сервиса `loyal-youth`
   - Новое значение: `https://grow-platform-backend-prod-production.up.railway.app`
   - Перезадеплоить фронт

3. **Альтернатива**:
   - Исправить ошибку компиляции в новом backend (`@grow/core`)
   - Оставить текущий `VITE_API_BASE_URL`
