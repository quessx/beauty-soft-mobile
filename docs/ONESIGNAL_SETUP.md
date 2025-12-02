# OneSignal Setup Instructions

## 🚀 Пошаговая настройка OneSignal

### 1. Регистрация и создание приложения
1. Зайдите на https://onesignal.com/
2. Зарегистрируйтесь или войдите в аккаунт
3. Нажмите **"New App/Website"**
4. Выберите **"Web"** platform
5. Введите название приложения: "Alika Beauty Soft"
6. Нажмите **"Create App"**

### 2. Настройка Web Platform
1. В настройках приложения выберите **"Web Push"**
2. **Site Name**: "Alika Beauty Soft Mobile"
3. **Site URL**: 
   - Development: `http://localhost:4200` или `https://dev.alika.ai`
   - Production: `https://alika.ai` (ваш реальный домен)
4. **Auto Resubscribe**: включить
5. **Default Notification Icon URL**: `/icons/icon-192x192.png`
6. **Default Notification Badge URL**: `/icons/icon-72x72.png`
7. Нажмите **"Save"**

### 3. Получение App ID
1. В Dashboard OneSignal найдите **"App ID"** 
2. Скопируйте значение (например: `12345678-1234-1234-1234-123456789abc`)
3. Вставьте в файл `src/environments/onesignal.ts`:

\`\`\`typescript
export const getOneSignalAppId = ( production: boolean ): string => {
    return production 
        ? 'YOUR_PRODUCTION_APP_ID'   // Вставьте сюда Production App ID
        : 'YOUR_DEVELOPMENT_APP_ID'; // Вставьте сюда Development App ID
};
\`\`\`

### 4. Настройка HTTPS (обязательно для Production)
OneSignal требует HTTPS для работы push-уведомлений:
- ✅ Development: `allowLocalhostAsSecureOrigin: true` уже настроено
- ⚠️ Production: обязательно используйте HTTPS домен

### 5. Тестирование
1. Запустите приложение: `ng serve`
2. Откройте браузер и разрешите уведомления
3. В консоли должно появиться: `✅ OneSignal initialized successfully`
4. В OneSignal Dashboard → **Audience** → **All Users** должен появиться ваш браузер

### 6. Отправка тестового сообщения
1. В OneSignal Dashboard → **Messages** → **New Push**
2. Выберите **"Send to Particular Segments"** → **"All Users"**
3. Заполните:
   - **Title**: "Тестовое уведомление"
   - **Message**: "Это тестовое сообщение от OneSignal"
   - **Icon**: `/icons/icon-192x192.png`
4. Нажмите **"Send Message"**

## 🔧 Troubleshooting

### Проблема: "OneSignal SDK not loaded"
- Проверьте, что файл `/sw/OneSignalSDKWorker.js` доступен
- Убедитесь, что нет блокировки браузером

### Проблема: "Push notifications not working"
- Убедитесь, что используете HTTPS (или localhost для разработки)
- Проверьте, что разрешения на уведомления предоставлены
- Проверьте App ID в конфигурации

### Проблема: "Service Worker conflicts"
- Убедитесь, что удалены все старые FCM service worker'ы
- Проверьте `ngsw-config.json` на исключение OneSignal SW

## 📱 Дополнительные возможности

### Сегментация пользователей
```typescript
// Установка тегов для сегментации
await oneSignalService.setTags({
    role: 'admin',
    department: 'beauty',
    location: 'moscow'
});
```

### Привязка к внутренним пользователям
```typescript
// Связываем OneSignal ID с вашим User ID
await oneSignalService.setUserId('user_123');
```

### Кастомные данные в уведомлениях
В OneSignal Dashboard при создании уведомления добавьте:
- **Additional Data**: `{"page": "/appointments", "action": "view"}`

Обработка в коде:
```typescript
oneSignalService.onNotificationClicked((result) => {
    const data = result.notification.additionalData;
    if (data?.page) {
        // Навигация на нужную страницу
        this.router.navigate([data.page]);
    }
});
```