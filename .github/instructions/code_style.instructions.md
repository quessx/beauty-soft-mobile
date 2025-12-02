# Стиль кода

В проекте используются следующие правила оформления кода:

- Отступы — 4 пробела (для всех видов файлов: .ts, .html, .scss и др.).
- Перед круглыми скобками обязательно ставится пробел, после скобок — тоже.
- Открывающая фигурная скобка всегда на той же строке, что и круглые скобки.
- После открывающей фигурной скобки обязателен переход на новую строку.
- Запрещено использовать конструкции без фигурных скобок (даже для одной строки).
 - Запрещено писать однострочные `if` с `return` в одной строке. Всегда используйте многострочный блок для `if` с ранним возвратом.
- Запрещено использовать тип any.
- Запрещено объявлять переменные или функции без явного указания типа. Каждая переменная должна иметь тип, каждая функция — тип аргументов и возвращаемый тип.
- Каждый отдельный файл не должен превышать 400 строк кода.
- Запрещено использовать слои, находящиеся выше текущего (например, entities не может импортировать features, widgets не может импортировать pages и т.д.).
- Каждый компонент должен состоять из 4 файлов: .html, .scss, .ts, .spec.ts (тест).
- В проекте используется подход "чистый экспорт": каждая сущность (компонент, директива, сервис и т.д.) должна иметь свой файл index.ts, в котором явно указывается, что экспортируется из данной папки.
- В проекте используется политика "ранний возврат" (early return): условия и проверки должны завершаться return как можно раньше, чтобы избегать лишней вложенности кода.
- Приведение типов (type casting/as) запрещено. Используйте строгую типизацию и корректные типы данных.
- Импортировать компоненты, директивы, сервисы и другие сущности можно только из index.ts соответствующей папки, а не напрямую из файла реализации.
- Слой shared не имеет своего алиаса (@shared). Для импортов используются алиасы только для внутренних подпапок shared (например, @ui, @lib и т.д.).
- Все слои, кроме shared, могут импортировать из своего слоя только из вложенных папок своей сущности. Например, одна фича не может импортировать что-либо из другой фичи, но может импортировать из своих подпапок (ui, types, services и т.д.). Аналогично для entities, widgets, pages и других слоёв.
- Модификаторы доступа (public, private, protected) должны быть обязательно указаны для всех свойств и методов классов.
- Каждый компонент, директива, сервис и любая другая сущность, кроме слоя app, должны находиться в отдельной папке (например, button/button.component.ts, my-service/my-service.service.ts и т.д.). Это обеспечивает изоляцию, удобство поддержки и масштабирования кода. В этой же папке должен находиться свой index.ts, который экспортирует только публичные сущности данной папки. Импортировать такие сущности в другие части проекта можно только через этот index.ts, что исключает случайные зависимости и упрощает рефакторинг.

Дополнительное правило для автоматизированных изменений:

- Всегда явно указывайте типы для аргументов функций-колбеков (например, map, filter, forEach и других методов массивов), даже если TypeScript может вывести тип автоматически. Это повышает читаемость и соответствует строгой типизации.

Пример index.ts:
```typescript
// Правильно: явно экспортируем только нужные сущности
export { MyComponent } from "./my-component.component";
export { MyService } from "./my-service.service";
// Не экспортируем внутренние утилиты, если они не нужны снаружи
```

// Неправильно:
```typescript
// Экспортировать всё подряд нельзя
export * from "./my-component.component";
export * from "./my-service.service";
export * from "./utils";
```

Пример:
```typescript
// Правильно
if ( condition ) {
    doSomething ();
}

// Неправильно
if ( condition ) {
    doSomething (); }

// Неправильно
if ( condition )
    doSomething ();
import { MyService } from "./my-service";

// Неправильно
import { Something } from "../../../../entities/something";
import { Another } from "/absolute/path/to/module";
```

Пример раннего возврата:
```typescript
// Правильно
function doSomething ( value: number ): void {
    if ( value < 0 ) {
        return;
    }
    // основной код
}

// Неправильно
function doSomething ( value: number ): void {
    if ( value >= 0 ) {
        // основной код
    }
}
```

Дополнительный пример (запрещено):
```typescript
// Неправильно
if (!targetEl) { return; }

// Правильно
if (!targetEl) {
    return;
}
```

Пример приведения типов:
```typescript
// Неправильно
const el = document.getElementById ( 'root' ) as HTMLElement;

// Правильно
const el: HTMLElement | null = document.getElementById ( 'root' );
```

Пример импорта:
```typescript
// Правильно
import { MyComponent } from '@entities/my-entity'; // импорт из index.ts

// Неправильно
import { MyComponent } from '@entities/my-entity/my-entity.component'; // прямой импорт из файла
```

Пример импорта внутри слоя:
```typescript
// Структура:
// features/
//   ├── feature-a/
//   │   ├── ui/
//   │   └── index.ts
//   ├── feature-b/
//   │   └── index.ts

// Правильно (внутри feature-a):
import { FeatureAForm } from './ui/feature-a-form.component';

// Неправильно (внутри feature-a):
import { FeatureB } from '@features/feature-b';
```

Пример модификаторов доступа:
```typescript
class User {
    public name: string;
    private password: string;
    protected role: string;

    public constructor ( name: string, password: string, role: string ) {
        this.name = name;
        this.password = password;
        this.role = role;
    }

    public getRole ( ): string {
        return this.role;
    }

    private getPassword ( ): string {
        return this.password;
    }
}

// Неправильно
class UserBad {
    name: string;
    password: string;
    role: string;
    constructor ( name: string, password: string, role: string ) {
        this.name = name;
        this.password = password;
        this.role = role;
    }
    getRole ( ): string {
        return this.role;
    }
    getPassword ( ): string {
        return this.password;
    }
}
```

Пример структуры для компонента, сервиса и директивы:

```
shared/
  ui/
    button/
      button.component.ts
      button.component.html
      button.component.scss
      button.component.spec.ts
      index.ts
    my-directive/
      my-directive.directive.ts
      my-directive.directive.spec.ts
      index.ts
    my-service/
      my-service.service.ts
      my-service.service.spec.ts
      index.ts
```

Дополнительные правила:

- Слой (например, features, entities, widgets, pages, shared/ui и др.) не должен иметь своего index.ts. index.ts должен находиться только в папке конкретной сущности (компонента, директивы, сервиса и т.д.), а не на уровне слоя. Это предотвращает массовый экспорт и нарушение границ между сущностями.

