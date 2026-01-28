# Исправления MVP-сценария

## Выполненные исправления

### 1. ✅ Исправлен `getCultivars()` в `api.ts`
**Проблема:** Вызывал несуществующий endpoint `/api/v1/cultivars`

**Исправление:**
- Изменен на `GET /api/v1/plant-database/cannabis`
- Обработка формата ответа `{ items: [...] }`
- Маппинг в формат `Cultivar[]`

### 2. ✅ Исправлен `AddPlantModal.tsx`
**Проблема:** Использовал локальный `usePlantStore().addPlant()`, не вызывал API

**Исправления:**
- Импортирован `createPlant` из `@/api/api`
- Импортирован `getGrows` для получения списка grows
- Добавлен `useQuery` для загрузки grows
- Заменен `addPlant()` на `createPlant()` с правильным payload
- Добавлена обработка ошибок и loading состояние
- После создания - инвалидация и обновление dashboard через `queryClient.invalidateQueries`

**Payload формат:**
```typescript
{
  growId: string,              // Берется из первого доступного grow
  name: string,                // Обязательно
  cultivarId?: string,        // Если выбран из каталога
  strain?: string,            // Альтернатива name
  startDate: string,         // ISO дата
  plantProfile: {
    growMode: 'indoor' | 'outdoor' | 'greenhouse',
    notes?: string,
  }
}
```

### 3. ✅ Исправлен `CatalogPickerModal.tsx`
**Проблема:** Использовал локальный `CATALOG`, не вызывал API

**Исправления:**
- Добавлен `useQuery` для поиска через `GET /api/v2/catalogs/cannabis-strains/search?q=...`
- Показ результатов API при поиске
- Fallback на локальный `CATALOG` если используется mock data или поиск пустой
- Передача `cultivarId` при выборе из API результатов

### 4. ✅ Улучшена обработка ошибок авторизации
**Исправления:**
- Добавлен класс `AuthError` в `api.ts`
- Правильная обработка 401 ошибок
- `AuthContext` корректно обрабатывает `AuthError`

### 5. ✅ Исправлен `createPlant()` в `api.ts`
**Проблема:** Неправильная обработка ответа backend

**Исправление:**
- Backend возвращает `{ plantId: string }`
- После создания - автоматический fetch деталей через `getPlantDetail()`
- Возврат полного объекта `Plant`

## Оставшиеся проблемы

### 1. ⚠️ Авторизация в UI
**Проблема:** Пользователь не видит страницу логина при первом заходе

**Возможные причины:**
- `VITE_USE_MOCK` может быть установлен в `true` (нужно проверить Railway Variables)
- `ProtectedRoute` редиректит, но пользователь не понимает что делать
- Cookies могут не сохраняться из-за CORS настроек

**Решение:**
- Проверить `VITE_USE_MOCK=false` в Railway Variables для `loyal-youth`
- Убедиться, что после логина пользователь видит dashboard
- Добавить явное сообщение на странице логина о необходимости регистрации

### 2. ⚠️ Выбор grow при создании растения
**Текущее решение:** Используется первый доступный grow автоматически

**Улучшение:** Добавить выбор grow в форму `AddPlantModal` (опционально)

### 3. ⚠️ Обновление списка растений после создания
**Текущее решение:** Используется `queryClient.invalidateQueries`

**Проверка:** Убедиться, что `ShellScreen` использует правильный query key `['plants-dashboard']`

## Проверка работы

### Тестовый сценарий:

1. **Регистрация/Логин:**
   - Открыть https://loyal-youth-production.up.railway.app
   - Должна открыться страница `/login`
   - Создать аккаунт: `test@example.com` / `testpassword123`
   - После регистрации - редирект на `/` (dashboard)

2. **Выбор растения из каталога:**
   - Нажать "Добавить" → "Из каталога"
   - Ввести поисковый запрос (например, "blue" или "northern")
   - Должны появиться результаты из API
   - Выбрать растение

3. **Создание растения:**
   - Заполнить форму (название обязательно)
   - Нажать "Добавить"
   - Растение должно появиться в списке сразу
   - После обновления страницы (F5) - растение должно остаться

## Формат API endpoints

### Backend endpoints (работают):

- `POST /api/v2/auth/register` - регистрация ✅
- `POST /api/v2/auth/login` - логин ✅
- `GET /api/v2/auth/me` - получение текущего пользователя ✅
- `GET /api/v2/grows` - список grows ✅
- `POST /api/v2/grows` - создание grow ✅
- `GET /api/v1/plant-database/cannabis` - список всех сортов (требует auth) ✅
- `GET /api/v2/catalogs/cannabis-strains/search?q=...` - поиск сортов (публичный) ✅
- `POST /api/v1/plants` - создание растения ✅
- `GET /api/v2/plants/dashboard` - список растений ✅
- `GET /api/v2/plants/:id/detail` - детали растения ✅

## Следующие шаги

1. **Проверить `VITE_USE_MOCK`** в Railway Variables для `loyal-youth`
2. **Задеплоить изменения** в Railway
3. **Протестировать полный flow:** регистрация → выбор сорта → создание растения → проверка сохранения
