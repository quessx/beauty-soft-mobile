# Push Notifications Service

Полная реализация Push-уведомлений на базе OneSignal Web SDK согласно техническому заданию.

## Возможности

- ✅ Инициализация OneSignal Web SDK
- ✅ Service Worker `OneSignalSDKWorker.js` с обработчиком background-сообщений
- ✅ `requestPermission()` - запрос разрешений на уведомления
- ✅ `getPlayerId()` - получение Player ID
- ✅ Регистрация device token на бэкенде `POST /api/push/device-tokens`
- ✅ Подписка на обновление Player ID (`onPlayerIdRefresh`)
- ✅ Foreground-обработка сообщений `setupMessageListener()` (toast/баннер)
- ✅ Деактивация Player ID при логауте `POST /api/push/device-tokens/deactivate`
- ✅ Ретраи для 5xx ошибок (1s/5s/30s, до 3 попыток)

## Конфигурация

### 1. Environment настройки

Добавлено в `src/environments/environment.ts` и `environment.development.ts`:

```typescript
export const environment: Environment = {
    // ...existing config
    oneSignal: {
        appId: 'YOUR_ONESIGNAL_APP_ID'
    }
};
```

### 2. Service Worker

Файл `public/OneSignalSDKWorker.js` уже настроен и будет доступен по адресу:
- `http://localhost:4200/OneSignalSDKWorker.js` (dev)
- `https://yoursite.com/OneSignalSDKWorker.js` (prod)

### 3. Angular Service Worker исключения

В `ngsw-config.json`:
```json
{
  "navigationUrls": [
    "/**",
    "!/OneSignalSDKWorker.js"
  ]
}
```

## API Сервиса

### Основные методы

```typescript
class PushNotificationsService {
  // Инициализация SDK
  initialize(): Promise<void>
  
  // Запрос разрешений
  requestPermission(): Promise<boolean>
  
  // Получение Player ID
  getPlayerId(): Promise<string | null>
  
  // Подписка на обновления Player ID
  onPlayerIdRefresh(callback: (id: string) => void): void
  
  // Подписка на foreground сообщения
  setupMessageListener(callback: (payload: NotificationPayload) => void): void
  
  // Регистрация на бэкенде
  registerOnBackend(params: {
    clientId: string;
    playerId: string;
    platform?: 'web';
    metadata?: Record<string, any>;
  }): Promise<void>
  
  // Деактивация на бэкенде
  deactivateOnBackend(params: { playerId: string }): Promise<void>
  
  // Полная инициализация с регистрацией
  initializeWithRegistration(clientId: string): Promise<string | null>
  
  // Деактивация при логауте
  deactivate(): Promise<void>
}
```

## Использование

### 1. Базовая инициализация

```typescript
import { PushNotificationsService } from '@lib/services/push-notifications';

@Component({})
export class AppComponent {
  constructor(private pushService: PushNotificationsService) {}
  
  async ngOnInit() {
    try {
      await this.pushService.initialize();
      console.log('✅ Push service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize push service:', error);
    }
  }
}
```

### 2. Полная инициализация с регистрацией

```typescript
async initializePushNotifications(clientId: string) {
  try {
    const playerId = await this.pushService.initializeWithRegistration(clientId);
    
    if (playerId) {
      console.log('✅ Push notifications ready, Player ID:', playerId);
    } else {
      console.warn('⚠️ Push notifications not available');
    }
  } catch (error) {
    console.error('❌ Push initialization failed:', error);
  }
}
```

### 3. Обработка foreground сообщений

```typescript
ngOnInit() {
  // Настройка обработчика foreground уведомлений
  this.pushService.setupMessageListener((notification) => {
    // Показать toast или баннер
    this.showNotificationToast(notification);
  });
  
  // Настройка обработчика обновления Player ID
  this.pushService.onPlayerIdRefresh((newPlayerId) => {
    console.log('🔄 Player ID updated:', newPlayerId);
    // Можно обновить на бэкенде или в локальном storage
  });
}

private showNotificationToast(notification: any) {
  // Интеграция с вашей toast/notification системой
  this.toastService.show({
    title: notification.title,
    message: notification.body,
    type: 'info'
  });
}
```

### 4. Деактивация при логауте

```typescript
async logout() {
  try {
    // Деактивируем push-уведомления
    await this.pushService.deactivate();
    
    // Остальная логика логаута...
    await this.authService.logout();
    
  } catch (error) {
    console.error('❌ Logout error:', error);
  }
}
```

## API Контракты

### POST /api/push/device-tokens

**Request:**
```json
{
  "client": "/api/clients/12345",
  "playerId": "550e8400-e29b-41d4-a716-446655440000",
  "platform": "web",
  "isActive": true,
  "metadata": {
    "appVersion": "1.0.0",
    "deviceModel": "Browser",
    "userAgent": "Mozilla/5.0..."
  }
}
```

**Response:** `201 Created` или `4xx/5xx` для ошибок

### POST /api/push/device-tokens/deactivate

**Request:**
```json
{
  "playerId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:** `200 OK` или `4xx/5xx` для ошибок

## Ошибки и ретраи

- **4xx ошибки**: без ретраев (клиентские ошибки)
- **5xx ошибки**: с ретраями (1s → 5s → 30s, до 3 попыток)
- **Network ошибки**: с ретраями

## Тестирование

Создан демо-компонент для тестирования всех функций:

```typescript
import { PushNotificationsDemoComponent } from '@shared/components/push-notifications-demo';

// Добавить в роутинг или использовать в любом компоненте
<bsm-push-notifications-demo></bsm-push-notifications-demo>
```

## Проверка готовности (DoD)

- [x] Инициализация SDK + SW
- [x] Регистрация/refresh Player ID и отправка на бэкенд
- [x] Foreground обработка сообщений
- [x] Деактивация Player ID при логауте
- [x] Ретраи для 5xx ошибок
- [x] Конфигурация по окружениям
- [x] Демо-компонент для тестирования

## Интеграция в существующий проект

1. **В app.component.ts** уже настроена базовая инициализация
2. **При логине** - вызвать `initializeWithRegistration(clientId)`
3. **При логауте** - вызвать `deactivate()`
4. **Для toast/баннеров** - настроить `setupMessageListener()` callback
5. **Production App ID** - заменить в `environment.ts`

## Отладка

В консоли браузера будут логи:
- `✅ OneSignal initialized successfully`
- `🔐 Notification permission: granted`
- `🆔 Player ID: xxx-xxx-xxx`
- `✅ Device token registered on backend`
- `📩 Foreground notification received`
- `🔄 Player ID refreshed`

**Проверить Service Worker:** DevTools → Application → Service Workers