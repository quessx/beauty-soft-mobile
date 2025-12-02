# Public pages folder

Папка содержит в себе только публичные страницы

Пример структуры:
```
├── public/  
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