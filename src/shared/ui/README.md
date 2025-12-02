# shared/ui

Переиспользуемые UI-компоненты (кнопки, элементы форм и т.д.), которые могут использоваться в разных частях приложения.

Папки внутри shared/ui должны быть разбиты по смыслам: элементы форм, кнопки, выпадающие списки, чекбоксы и т.д. Каждый тип UI-элементов — в своей подпапке.

---

# Структура элементов слоя shared

В слое `shared` размещаются переиспользуемые компоненты, сервисы, утилиты и интерфейсы, которые могут использоваться в разных частях приложения.

## Общие требования
- Каждый элемент должен быть оформлен в отдельной папке с осмысленным названием.
- Названия файлов и папок должны быть в стиле kebab-case.
- В корне папки элемента не должно быть лишних файлов.

---

## Структура для **сервиса**

```
shared/
  lib/
    my-service/
      my-service.ts
      my-service.spec.ts
      index.ts
```

**Требования:**
- Файл сервиса: `my-service.ts`
- Тестовый файл: `my-service.spec.ts` (обязателен)
- Индексный файл: `index.ts` (экспорт сервиса)

---

## Структура для **компонента**

```
shared/
  ui/
    my-component/
      my-component.component.ts
      my-component.component.html
      my-component.component.scss
      my-component.component.spec.ts
      index.ts
```

**Требования:**
- Логика компонента: `my-component.component.ts`
- Шаблон: `my-component.component.html`
- Стили: `my-component.component.scss`
- Тестовый файл: `my-component.component.spec.ts` (обязателен)
- Индексный файл: `index.ts` (экспорт компонента)

---

## Важно
- Для сервисов и компонентов обязательно наличие тестового файла (`spec.ts`).
- Для компонентов обязательно наличие всех файлов: `.ts`, `.html`, `.scss`, `.spec.ts`.
- Внутри index.ts экспортируйте только публичные API.
- Соблюдайте единый стиль именования и структуру.

---

## Организация внутренних элементов

Если внутри компонента или сервиса используются дополнительные элементы, они должны быть организованы в соответствующих подпапках:

```
shared/
  ui/
    my-complex-component/
      types/
        my-component.types.ts
        my-component.interfaces.ts
      ui/
        sub-component/
          sub-component.component.ts
          sub-component.component.html
          sub-component.component.scss
      services/
        my-component.service.ts
        my-component.service.spec.ts
      utils/
        my-component.utils.ts
        my-component.utils.spec.ts
      my-complex-component.component.ts
      my-complex-component.component.html
      my-complex-component.component.scss
      my-complex-component.component.spec.ts
      index.ts
```

**Правила организации:**
- `types/` - интерфейсы, типы, enum'ы
- `ui/` - вспомогательные компоненты
- `services/` - внутренние сервисы компонента
- `utils/` - утилиты и хелперы
- `constants/` - константы
- `models/` - модели данных

---

## Пример экспорта в index.ts

⚠️ **Важно:** Избегайте использования `export *` - экспортируйте только нужные элементы поименно для лучшего tree-shaking и контроля API.

```typescript
// ❌ Неправильно
export * from './my-service';
export * from './my-component.component';

// ✅ Правильно
export { MyService } from './my-service';
export { MyComponent } from './my-component.component';
export type { MyComponentConfig } from './my-component.component';
```

---

## Пример компонента

```typescript
// my-component.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss']
})