# Field Coverage Report

## Обзор

Этот отчёт сравнивает поля, которые UI читает из API ответов, с реальными данными, которые приходят с production backend.

**Дата анализа**: 2026-01-28  
**Backend URL**: https://backend-production-2f72.up.railway.app

---

## GET /api/v2/plants/dashboard

### Поля, которые UI читает (из `src/pages/ShellScreen.tsx`):

| Поле | Тип | Использование в UI | Статус |
|------|-----|-------------------|--------|
| `plant.id` | `string` | Ключ для списка, ссылка на детали | ✅ |
| `plant.name` | `string \| null` | Отображение названия растения | ✅ |
| `plant.cultivar.name` | `string` | Отображение сорта (fallback для name) | ❌ |
| `plant.stage` | `PlantStage` | Определение стадии (SEEDLING/VEGETATIVE/etc) | ⚠️ |
| `plant.status` | `PlantStatus` | Фильтрация активных растений (ACTIVE) | ⚠️ |
| `plant.todayRecommendation` | `string \| null` | Рекомендация на сегодня (показывается если есть) | ⚠️ |

### Реальная структура ответа:

```json
{
  "items": [
    {
      "id": "9ee4f06c-a0ed-452b-b812-5f75a3b72cf9",
      "name": "Smoke3",
      "cultivar": null,
      "type": "autoflower",
      "plantType": {
        "key": "cannabis",
        "displayName": "Каннабис"
      },
      "status": "OK",
      "currentStage": "Проращивание",
      "primaryRecommendation": {
        "title": "Держите субстрат слегка влажным",
        "actionText": "Проверить влажность",
        "priority": "HIGH"
      },
      "lifecycleState": "ACTIVE",
      "lifecycleV1Stage": "SEED",
      "growId": "e3eb4c22-d4c9-41df-8e3f-b4336a2ba9f1",
      "startDate": "2026-01-27T00:00:00.000Z"
    }
  ]
}
```

### Детальный анализ:

#### ✅ `plant.id`
- **Ожидается**: `string`
- **Реально**: `string` ✅
- **Статус**: Поле есть всегда

#### ✅ `plant.name`
- **Ожидается**: `string | null`
- **Реально**: `string` (всегда присутствует в примерах)
- **Статус**: Поле есть всегда

#### ❌ `plant.cultivar.name`
- **Ожидается**: `string` (обязательное поле объекта `cultivar`)
- **Реально**: `cultivar: null` (всегда null в примерах)
- **Статус**: Поля нет. UI использует fallback: `plant.name || plant.cultivar.name || 'Без названия'`
- **Проблема**: UI будет падать при попытке доступа к `plant.cultivar.name` если `cultivar === null`
- **Решение**: Нужно добавить проверку: `plant.cultivar?.name`

#### ⚠️ `plant.stage`
- **Ожидается**: `PlantStage` ('SEEDLING' | 'VEGETATIVE' | 'FLOWERING' | 'HARVEST' | 'DRYING' | 'CURING')
- **Реально**: `lifecycleV1Stage: "SEED"` (не соответствует ожидаемым значениям)
- **Статус**: Поле есть, но значения не совпадают с ожидаемыми
- **Проблема**: 
  - Backend возвращает: `"SEED"`, `"GERMINATION"` и другие значения
  - UI ожидает: `"SEEDLING"`, `"VEGETATIVE"`, `"FLOWERING"`, `"HARVEST"`, `"DRYING"`, `"CURING"`
- **Решение**: Нужен маппинг значений или адаптер

#### ⚠️ `plant.status`
- **Ожидается**: `PlantStatus` ('ACTIVE' | 'FROZEN' | 'COMPLETED')
- **Реально**: `lifecycleState: "ACTIVE"` (совпадает) + `status: "OK"` (другое поле)
- **Статус**: Поле есть, но называется `lifecycleState` вместо `status`
- **Проблема**: UI читает `plant.status`, но реальное поле называется `lifecycleState`
- **Решение**: Использовать `lifecycleState` вместо `status`

#### ⚠️ `plant.todayRecommendation`
- **Ожидается**: `string | null`
- **Реально**: `primaryRecommendation: { title: string, actionText: string, priority: string }`
- **Статус**: Поле есть, но структура другая
- **Проблема**: UI ожидает строку, но приходит объект
- **Решение**: Использовать `primaryRecommendation.title` вместо `todayRecommendation`

#### ❌ `plant.growName`
- **Ожидается**: `string` (в типе `PlantDashboardItem`)
- **Реально**: Нет в ответе
- **Статус**: Поля нет
- **Примечание**: В ShellScreen не используется, но есть в типе

#### ❌ `plant.ageInDays`
- **Ожидается**: `number` (в типе `PlantDashboardItem`)
- **Реально**: Нет в ответе
- **Статус**: Поля нет
- **Примечание**: В ShellScreen не используется, но есть в типе

---

## GET /api/v2/plants/:id/detail

### Поля, которые UI читает (из `src/pages/PlantDetailScreen.tsx`):

| Поле | Тип | Использование в UI | Статус |
|------|-----|-------------------|--------|
| `plant.id` | `string` | Используется в роутинге | ✅ |
| `plant.name` | `string \| null` | Отображение названия в заголовке | ✅ |
| `plant.cultivar.name` | `string` | Отображение сорта (fallback для name) | ❌ |
| `plant.stage` | `PlantStage` | Отображение стадий и прогресса | ⚠️ |
| `plant.ageInDays` | `number` | Отображение возраста растения | ❌ |
| `plant.startDate` | `string` | Отображение даты начала (если есть) | ✅ |
| `plant.todayRecommendation` | `string \| null` | Рекомендация "Что дальше?" | ⚠️ |
| `plant.notes` | `string \| null` | Отображение заметок (если есть) | ❌ |
| `plant.recentActions` | `PlantAction[]` | История действий (если есть) | ❌ |
| `plant.recentActions[].id` | `string` | Ключ для списка | ⚠️ |
| `plant.recentActions[].type` | `PlantActionType` | Тип действия (WATER/FEED/etc) | ⚠️ |
| `plant.recentActions[].performedAt` | `string` | Дата выполнения действия | ⚠️ |
| `plant.recentActions[].notes` | `string \| null` | Заметки к действию | ❌ |

### Реальная структура ответа:

```json
{
  "id": "9ee4f06c-a0ed-452b-b812-5f75a3b72cf9",
  "name": "Smoke3",
  "cultivar": null,
  "type": "autoflower",
  "plantType": {
    "key": "cannabis",
    "displayName": "Каннабис"
  },
  "grow": {
    "id": "e3eb4c22-d4c9-41df-8e3f-b4336a2ba9f1",
    "name": "My Grow"
  },
  "lifecycleState": "ACTIVE",
  "lifecycleV1Stage": "SEED",
  "currentStage": {
    "key": "SEED",
    "name": "Проращивание",
    "source": "TIME_BASED",
    "startAt": "2026-01-27T00:00:00.000Z",
    "endAt": null,
    "expectations": [...]
  },
  "startDate": "2026-01-27T00:00:00.000Z",
  "primaryRecommendation": {
    "title": "Держите субстрат слегка влажным",
    "actionText": "Проверить влажность",
    "priority": "HIGH"
  },
  "recommendations": [
    {
      "id": "cannabis:SEED:moisture",
      "title": "...",
      "description": "...",
      "actionText": "...",
      "priority": "HIGH",
      "rationale": "...",
      "actionKey": "water"
    }
  ],
  "events": [
    {
      "id": "d0f37433-9548-4e99-abe8-33ecdfb8838a",
      "timestamp": "2026-01-27T21:56:38.723Z",
      "title": "PLANT_PROACTIVE_DAY_0",
      "meta": null,
      "type": "PLANT_PROACTIVE_DAY_0"
    }
  ]
}
```

### Детальный анализ:

#### ✅ `plant.id`
- **Ожидается**: `string`
- **Реально**: `string` ✅
- **Статус**: Поле есть всегда

#### ✅ `plant.name`
- **Ожидается**: `string | null`
- **Реально**: `string` ✅
- **Статус**: Поле есть всегда

#### ❌ `plant.cultivar.name`
- **Ожидается**: `string` (обязательное поле объекта `cultivar`)
- **Реально**: `cultivar: null` (всегда null в примерах)
- **Статус**: Поля нет. UI использует fallback: `plant.name || plant.cultivar.name || 'Без названия'`
- **Проблема**: UI будет падать при попытке доступа к `plant.cultivar.name` если `cultivar === null`
- **Решение**: Нужно добавить проверку: `plant.cultivar?.name`

#### ⚠️ `plant.stage`
- **Ожидается**: `PlantStage` ('SEEDLING' | 'VEGETATIVE' | 'FLOWERING' | 'HARVEST' | 'DRYING' | 'CURING')
- **Реально**: `lifecycleV1Stage: "SEED"` или `currentStage.key: "SEED"`
- **Статус**: Поле есть, но значения не совпадают
- **Проблема**: Backend возвращает другие значения стадий
- **Решение**: Нужен маппинг значений

#### ❌ `plant.ageInDays`
- **Ожидается**: `number`
- **Реально**: Нет в ответе
- **Статус**: Поля нет
- **Проблема**: UI показывает "Возраст: {plant.ageInDays} дн.", но поле отсутствует
- **Решение**: Вычислять из `startDate` или добавить поле на backend

#### ✅ `plant.startDate`
- **Ожидается**: `string`
- **Реально**: `string` (ISO format) ✅
- **Статус**: Поле есть всегда

#### ⚠️ `plant.todayRecommendation`
- **Ожидается**: `string | null`
- **Реально**: `primaryRecommendation: { title: string, ... }` или `recommendations: array`
- **Статус**: Поле есть, но структура другая
- **Проблема**: UI ожидает строку, но приходит объект или массив
- **Решение**: Использовать `primaryRecommendation.title` или `recommendations[0].title`

#### ❌ `plant.notes`
- **Ожидается**: `string | null`
- **Реально**: Нет в ответе
- **Статус**: Поля нет
- **Проблема**: UI показывает секцию "Заметки" если `plant.notes` есть, но поле отсутствует
- **Решение**: Добавить поле на backend или убрать секцию из UI

#### ❌ `plant.recentActions`
- **Ожидается**: `PlantAction[]` где `PlantAction = { id, type, performedAt, notes }`
- **Реально**: `events: array` с другой структурой
- **Статус**: Поля нет в ожидаемом формате
- **Проблема**: 
  - UI ожидает массив действий с полями: `id`, `type` (WATER/FEED), `performedAt`, `notes`
  - Backend возвращает `events` с полями: `id`, `timestamp`, `title`, `type`, `meta`
  - Структура и значения не совпадают
- **Решение**: 
  - Маппинг `events` в `recentActions`
  - Или использовать `events` напрямую с адаптацией UI

#### ⚠️ `plant.recentActions[].id`
- **Ожидается**: `string`
- **Реально**: В `events[].id` есть ✅
- **Статус**: Поле есть в альтернативной структуре

#### ⚠️ `plant.recentActions[].type`
- **Ожидается**: `PlantActionType` ('WATER' | 'FEED' | 'COMPLETE')
- **Реально**: В `events[].type` есть, но значения другие (например, 'PLANT_PROACTIVE_DAY_0')
- **Статус**: Поле есть, но значения не совпадают
- **Решение**: Нужен маппинг типов событий в типы действий

#### ⚠️ `plant.recentActions[].performedAt`
- **Ожидается**: `string` (ISO date)
- **Реально**: В `events[].timestamp` есть ✅
- **Статус**: Поле есть, но называется `timestamp` вместо `performedAt`

#### ❌ `plant.recentActions[].notes`
- **Ожидается**: `string | null`
- **Реально**: Нет в `events`
- **Статус**: Поля нет

#### ❌ `plant.growName`
- **Ожидается**: `string` (в типе `PlantDetail`)
- **Реально**: `grow: { id, name }` (объект вместо строки)
- **Статус**: Поле есть, но структура другая
- **Решение**: Использовать `grow.name` вместо `growName`

---

## Резюме

### Критические проблемы (❌):

1. **`cultivar.name`** - всегда `null`, UI будет падать при доступе
2. **`ageInDays`** - отсутствует, UI показывает undefined
3. **`notes`** - отсутствует, секция никогда не показывается
4. **`recentActions`** - отсутствует в ожидаемом формате, есть только `events` с другой структурой

### Проблемы совместимости (⚠️):

1. **`stage`** - значения не совпадают (SEED vs SEEDLING)
2. **`status`** - поле называется `lifecycleState`
3. **`todayRecommendation`** - объект вместо строки
4. **`growName`** - объект `grow` вместо строки
5. **`recentActions`** - нужно маппинг из `events`

### Работающие поля (✅):

1. **`id`** - всегда присутствует
2. **`name`** - всегда присутствует
3. **`startDate`** - всегда присутствует

---

## Рекомендации

1. **Немедленно исправить**: Добавить проверки на `null` для `cultivar` во всех местах использования
2. **Адаптер данных**: Создать адаптер для преобразования ответов backend в формат, ожидаемый UI
3. **Маппинг стадий**: Создать функцию маппинга `lifecycleV1Stage` → `PlantStage`
4. **Вычисление возраста**: Вычислять `ageInDays` из `startDate` на клиенте или добавить на backend
5. **Маппинг событий**: Преобразовывать `events` в `recentActions` с правильными типами
