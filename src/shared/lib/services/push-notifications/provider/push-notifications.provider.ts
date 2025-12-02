import { Capacitor } from '@capacitor/core';
import { PUSH_NOTIFICATIONS_SERVICE } from '../push-notifications.token';
import { WebPushNotificationsService } from '../web-push-notifications.service';
import { AndroidPushNotificationsService } from '../android-push-notifications.service';
import { Provider } from '@angular/core';
import { OneSignal } from 'onesignal-ngx';
/**
 * Функция для выбора правильного провайдера push-уведомлений в зависимости от платформы
 */
export function providePushNotifications(): Provider[] {
    const platform: string = Capacitor.getPlatform();

    if ( platform === 'android' || platform === 'ios' ) {
        return [
            {
                provide: PUSH_NOTIFICATIONS_SERVICE,
                useClass: AndroidPushNotificationsService
            }
        ];
    } else {
        // Web platform - используем OneSignal
        return [
            OneSignal,
            {
                provide: PUSH_NOTIFICATIONS_SERVICE,
                useClass: WebPushNotificationsService
            }
        ];
    }
}