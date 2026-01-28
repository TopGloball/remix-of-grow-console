# Проблемы MVP-сценария и решения

## Выявленные проблемы

### 1. ❌ Авторизация не работает в UI
**Проблема:** Frontend не показывает страницу логина, пользователь не может залогиниться.

**Причина:** 
- `ProtectedRoute` редиректит на `/login`, но пользователь не видит форму логина
- Возможно, `VITE_USE_MOCK=false` не установлен правильно, или фронт все еще использует моки

**Решение:**
- Проверить, что `VITE_USE_MOCK=false` установлен в Railway Variables
- Убедиться, что `AuthContext` правильно обрабатывает ошибки 401
- Добавить явную проверку авторизации при загрузке страницы

### 2. ❌ Растения не добавляются
**Проблема:** `AddPlantModal` использует локальный `usePlantStore().addPlant()`, который НЕ вызывает API.

**Код проблемы:**
```typescript
// remix-of-grow-console/src/components/modals/AddPlantModal.tsx:64
addPlant({
  name: name.trim(),
  cultivar: cultivar || name.trim(),
  // ... локальное сохранение, не API!
});
```

**Решение:**
- Заменить `usePlantStore().addPlant()` на `createPlant()` из `@/api/api`
- Добавить обработку ошибок и loading состояние
- После успешного создания - обновить список растений через `getPlantsDashboard()`

### 3. ❌ Нельзя выбрать растение из базы
**Проблема:** `CatalogPickerModal` использует локальный `CATALOG` из `plantStore.ts`, не вызывает API.

**Код проблемы:**
```typescript
// remix-of-grow-console/src/components/modals/CatalogPickerModal.tsx:34
const filteredItems = CATALOG.filter(...); // Локальный массив!
```

**Решение:**
- Использовать `GET /api/v2/catalogs/cannabis-strains/search?q=...` для поиска
- Или `GET /api/v1/plant-database/cannabis` для списка всех сортов
- Обновить `getCultivars()` в `api.ts` на правильный endpoint

### 4. ⚠️ Неправильный endpoint для cultivars
**Проблема:** `getCultivars()` вызывает `/api/v1/cultivars`, которого нет.

**Решение:**
- Изменить на `GET /api/v1/plant-database/cannabis` (возвращает `{ items: [...] }`)
- Или использовать `GET /api/v2/catalogs/cannabis-strains/search?q=` для поиска

## Что нужно исправить

### Приоритет 1: Критично для MVP

1. **Исправить `AddPlantModal.tsx`:**
   - Импортировать `createPlant` из `@/api/api`
   - Импортировать `getGrows` для получения списка grows
   - Заменить `addPlant()` на `createPlant()` с правильным payload
   - Добавить выбор grow (или использовать первый доступный)
   - После создания - обновить dashboard через `getPlantsDashboard()`

2. **Исправить `CatalogPickerModal.tsx`:**
   - Добавить поиск через `GET /api/v2/catalogs/cannabis-strains/search?q=...`
   - Показывать результаты поиска вместо локального `CATALOG`
   - При выборе - передавать `cultivarId` в `AddPlantModal`

3. **Исправить `getCultivars()` в `api.ts`:**
   - Изменить endpoint на `/api/v1/plant-database/cannabis`
   - Обработать формат ответа `{ items: [...] }`

4. **Проверить авторизацию:**
   - Убедиться, что `VITE_USE_MOCK=false` установлен
   - Проверить, что `ProtectedRoute` правильно редиректит на `/login`
   - Убедиться, что после логина пользователь видит dashboard

### Приоритет 2: Улучшения

1. Добавить обработку ошибок при создании растения
2. Добавить loading состояния
3. Добавить toast-уведомления об успехе/ошибке
4. Обновлять список растений после создания

## Формат payload для создания растения

Согласно backend (`backend/src/routes/plants.ts`), `POST /api/v1/plants` принимает:

```typescript
{
  growId?: string,           // Опционально (backend создаст дефолтный)
  name?: string,             // Опционально (если есть cultivarId)
  strain?: string,           // Альтернатива name
  cultivarId?: string,       // ID из plant-database/cannabis
  startDate?: string,        // ISO дата (опционально, по умолчанию сегодня)
  plantProfile?: object,     // Опционально, может быть {}
}
```

Backend автоматически:
- Создает дефолтный grow, если `growId` не указан
- Использует `cultivar.displayName` как имя, если `name` не указан
- Устанавливает `startDate = today`, если не указан

## Проверка работы backend

✅ Регистрация: `POST /api/v2/auth/register` - работает
✅ Логин: `POST /api/v2/auth/login` - работает  
✅ Получение grows: `GET /api/v2/grows` - работает
✅ Создание grow: `POST /api/v2/grows` - работает
✅ Список сортов: `GET /api/v1/plant-database/cannabis` - требует авторизацию
✅ Поиск сортов: `GET /api/v2/catalogs/cannabis-strains/search?q=...` - работает (публичный)
⏳ Создание растения: `POST /api/v1/plants` - требует правильный payload и авторизацию
