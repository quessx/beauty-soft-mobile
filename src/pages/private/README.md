# Private pages folder

Папка содержит в себе только приватные страницы

Пример структуры:
```
├── private/  
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