# Backend Services в Railway

## Старый готовый backend (используется)

**Service Name**: `grow-platform-backend-prod`

**Публичный URL**: `https://grow-platform-backend-prod-production.up.railway.app`

**Статус**: ✅ Публичный домен создан и доступен

**Использование**: Этот сервис является исходным готовым backend и используется в production.

**VITE_API_BASE_URL**: `https://grow-platform-backend-prod-production.up.railway.app`

## Новый backend (не используется)

**Service Name**: `backend`

**Публичный URL**: `https://backend-production-2f72.up.railway.app`

**Статус**: ❌ Не работает (502) - ошибка компиляции TypeScript (`@grow/core` не найден)

**Проблема**: Backend не запускается из-за ошибки компиляции, поэтому не используется.

## Frontend Service

**Service Name**: `loyal-youth`

**Публичный URL**: `https://loyal-youth-production.up.railway.app`

**VITE_API_BASE_URL**: Обновлен на `https://grow-platform-backend-prod-production.up.railway.app`
