# Слой pages

Слой страниц. Каждая страница объединяет виджеты и фичи для отображения конкретного экрана. Отвечает за расположение виджетов на странице, может обеспечивать связь между виджетами.

Пример структуры:
```
├── pages/                   # Слой 'pages' - страницы
│   ├── clients/
│   │   ├── types/           # типы и интерфейсы
│   │   │   └── clients-page.types.ts
│   │   ├── services/        # логика страницы, чтобы компоненту не пришлось ее содержать
│   │   │   └── clients-page.data.service.ts
│   │   ├── index.ts
│   │   └── clients.component.ts
│   ├── client/
│   │   ├── types/
│   │   │   └── client-page.types.ts
│   │   ├── services/
│   │   │   └── client-page.data.service.ts
│   │   ├── index.ts
│   │   └── client.component.ts
│   └── ...
```
