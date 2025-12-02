import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import OneSignal from 'onesignal-cordova-plugin';
import { IPushNotificationsService } from './interfaces';

@Injectable()
export class AndroidPushNotificationsService extends IPushNotificationsService {
    constructor() {
        if ( !environment.oneSignal ) {
            return;
        }
        super();
        OneSignal.initialize( environment.oneSignal.appId );
        this.inited.set( true );
    }

    protected async optIn(): Promise<void> {
        return OneSignal.User.pushSubscription.optIn();
    }

    protected async optOut(): Promise<void> {
        const optedIn: boolean = await OneSignal.User.pushSubscription.getOptedInAsync();
        return optedIn ? OneSignal.User.pushSubscription.optOut() : Promise.resolve();
    }

    protected async requestPermission(): Promise<boolean> {
        try {
            const permission: boolean = await OneSignal.Notifications.requestPermission();
            return permission;
        } catch ( error: unknown ) {
            console.error( '❌ Failed to request permission (Android):', error );
            return false;
        }
    }

    protected getPlayerId(): string | null {
        const playerId: string | null = OneSignal.User.pushSubscription.id || this.currentPlayerId;
        return playerId;
    }

    protected override async login( id: string ): Promise<void> {
        return OneSignal.login( id );
    }

    protected override async logout(): Promise<void> {
        return OneSignal.logout();
    }
}