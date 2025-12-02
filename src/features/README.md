# Слой features

Реализует бизнес-функционал, объединяя сущности и логику для конкретных пользовательских задач.

Пример структуры:
```
├── features/                # Слой 'features' - функциональные блоки
│   ├── popups/
│   │   ├── appointment-payment-popup/        # Вложенная фича (пользовательские истории)
│   │   │   ├── ui/          # Компоненты этой фичи
│   │   │   │   └── appointment-payment-popup-form
│   │   │   │       └── appointment-payment-popup-form.component.ts
│   │   │   ├── types/   # интерфейсы и типы этой фичи
│   │   │   │   └── appointment-payment-popup.intarface.ts
│   │   │   ├── lang/        # языковые файлы этой фичи
│   │   │   │   └── appointment-payment-popup.ru.lang.ts
│   │   │   ├── services/         # Хелперы, утилиты, логика
│   │   │   │   └── appointment-payment-popup.logic.ts
│   │   │   ├── selectors/        # выборка данных из сторов
│   │   │   │   └── get-clients-appointment-payment-popup.selector.service.ts
│   │   │   ├── index.ts
│   │   │   └── appointment-payment-popup.component.ts
│   │   ├── assign-service-good/
│   │   │   └── ...
│   │   └── ...
│   ├── shedule/
│   │   └── ...
│   └── ...
```
