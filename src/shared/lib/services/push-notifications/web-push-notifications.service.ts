import { Injectable, inject } from '@angular/core';
import { environment } from '@environment/environment';
import { OneSignal } from 'onesignal-ngx';
import { IPushNotificationsService } from './interfaces';

@Injectable()
export class WebPushNotificationsService extends IPushNotificationsService {
    private oneSignal: OneSignal = inject( OneSignal );

    constructor() {
        super();
        if ( !environment.oneSignal ) {
            return;
        }
        this.oneSignal.init( {
            appId: environment.oneSignal.appId,
            safari_web_id: environment.oneSignal.safari_web_id,
            serviceWorkerPath: 'onesignal/OneSignalSDKWorker.js',
            allowLocalhostAsSecureOrigin: !environment.production,
            autoRegister: false,
            autoResubscribe: true,
            serviceWorkerParam: {
                scope: '/onesignal/'
            }
        } )
            .then( () => {
                this.inited.set( true );
            } )
            .catch( console.warn );
    }

    protected optIn(): Promise<void> {
        return this.oneSignal.User.PushSubscription.optIn();
    }

    protected optOut(): Promise<void> {
        if ( this.oneSignal.User.PushSubscription.optedIn ) {
            return this.oneSignal.User.PushSubscription.optOut();
        }
        return Promise.resolve();
    }

    protected async requestPermission(): Promise<boolean> {
        const permission: NotificationPermission = await Notification.requestPermission();
        const granted: boolean = permission === 'granted';
        return granted;
    }

    protected getPlayerId(): string | null {
        const playerId: string | null = this.oneSignal.User?.PushSubscription?.id || this.currentPlayerId;
        return playerId;
    }

    override login( id: string ): Promise<void> {
        return this.oneSignal.login( id );
    }

    override logout(): Promise<void> {
        return this.oneSignal.logout();
    }
}