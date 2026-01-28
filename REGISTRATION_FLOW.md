# Реализация регистрации для тестового доступа

## Что сделано

### 1. Добавлена функция `register` в API (`src/api/api.ts`)
- Endpoint: `/api/v2/auth/register`
- Формат: `{ email: string, password: string }`
- После успешной регистрации автоматически вызывается `/api/v2/auth/me` для получения данных пользователя
- Cookies устанавливаются автоматически браузером

### 2. Обновлен `AuthContext` (`src/context/AuthContext.tsx`)
- Добавлены функции `login` и `register` в контекст
- После успешного login/register пользователь сохраняется в состоянии
- Автоматически вызывается `/api/v2/auth/me` для получения данных пользователя

### 3. Обновлена страница Login (`src/pages/Login.tsx`)
- Добавлена кнопка переключения между режимами "Войти" и "Создать аккаунт"
- Форма автоматически переключается между login и register
- После успешного login/register происходит редирект на `/`
- Валидация: email должен содержать `@`, password минимум 8 символов

### 4. Обновлен конфиг API (`src/api/config.ts`)
- Добавлен endpoint `AUTH_REGISTER: '/api/v2/auth/register'`

## Flow работы

1. Пользователь открывает `/login`
2. Нажимает "Создать тестовый аккаунт"
3. Вводит email и password (минимум 8 символов)
4. Нажимает "Создать аккаунт"
5. Происходит запрос `POST /api/v2/auth/register`
6. Backend устанавливает cookies (`access_token`, `refresh_token`)
7. Автоматически вызывается `GET /api/v2/auth/me` для получения данных пользователя
8. Пользователь сохраняется в `AuthContext`
9. Происходит редирект на `/` (dashboard)
10. Dashboard загружает данные через `GET /api/v2/plants/dashboard`
11. При клике на растение открывается `/plants/:plantId` с данными из `GET /api/v2/plants/:plantId/detail`

## Тестовые данные

Для тестирования можно использовать любой email и password (минимум 8 символов).

Пример:
- Email: `test@example.com`
- Password: `test12345`

После регистрации автоматически создаются стартовые растения для нового пользователя.

## Проверка на Railway

**Frontend URL**: `https://loyal-youth-production.up.railway.app`
**Backend URL**: `https://backend-production-2f72.up.railway.app`

**Примечание**: Backend в данный момент возвращает 502 (перезапускается после деплоя). После восстановления работы backend flow должен работать полностью.

## Что нужно проверить после восстановления backend

1. ✅ Регистрация работает: `POST /api/v2/auth/register` возвращает `201` и устанавливает cookies
2. ✅ `/me` работает: `GET /api/v2/auth/me` возвращает `200` с данными пользователя
3. ✅ Dashboard работает: `GET /api/v2/plants/dashboard` возвращает `200` с массивом растений
4. ✅ Plant detail работает: `GET /api/v2/plants/:plantId/detail` возвращает `200` с деталями растения
