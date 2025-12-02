import { InjectionToken } from '@angular/core';
import { IPushNotificationsService } from './interfaces';

export const PUSH_NOTIFICATIONS_SERVICE = new InjectionToken<IPushNotificationsService>('PushNotificationsService');