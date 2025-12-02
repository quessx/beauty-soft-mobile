import { effect, EffectRef, inject, Injectable, signal, WritableSignal } from "@angular/core";
import { ClientDeviceTokenService } from "@api/index";
import { Capacitor } from "@capacitor/core";
import { IUserAccountStore, UserAccountStore } from "@entities/user-account";
import { environment } from "@environment/environment";
import { firstValueFrom } from "rxjs";

@Injectable()
export abstract class IPushNotificationsService {
    protected inited: WritableSignal<boolean> = signal( false );
    protected currentPlayerId: string | null = null;
    protected currentEmployeeId: string | null = null;
    private userAccountStore: IUserAccountStore = inject( UserAccountStore );
    private clientDeviceTokenApi: ClientDeviceTokenService = inject( ClientDeviceTokenService );
    private get platform(): 'web' | 'ios' | 'android' {
        const platform: string = Capacitor.getPlatform();
        if ( platform === 'web' || platform === 'ios' || platform === 'android' ) {
            return platform;
        }
        throw Error( 'invaild platform' );
    }

    constructor() {
        if ( !environment.oneSignal ) {
            return;
        }
        const effectRef: EffectRef = effect( async () => {
            const employee: string | undefined = this.userAccountStore.additionalData()?.['@id'];
            const playerId: string | null = this.getPlayerId();
            if ( !employee || !playerId || !this.inited() ) {
                return;
            }
            this.currentPlayerId = playerId;
            this.currentEmployeeId = employee;
            // 1. Сначала запрашиваем разрешение на уведомления
            const hasPermission: boolean = await this.requestPermission();
            if ( hasPermission ) {
                try {
                    await this.optIn();
                } catch ( err: unknown ) {
                    console.error( err );
                }

                try {
                    await this.logout();
                } catch ( error ) {
                    console.error( error );
                }

                try {
                    await this.login( employee );
                } catch ( err: unknown ) {

                }

                await this.registerOrTouchOnBackend( { employee, playerId } );
            } else {
                console.warn( '⚠️ Notification permission denied (Web)' );
            }
            effectRef.destroy();
        } );
    }

    protected abstract optIn(): Promise<void>;
    protected abstract optOut(): Promise<void>;
    protected abstract login( id: string ): Promise<void>;
    protected abstract logout(): Promise<void>;

    /**
     * Запрос разрешения на push-уведомления
     */
    protected abstract requestPermission(): Promise<boolean>;

    /**
     * Получение Player ID/Token
     */
    protected abstract getPlayerId(): string | null;

    /**
     * Деактивация device token на бэкенде
     */
    private async deactivateOnBackend( { employee, playerId }: {
        employee: string;
        playerId: string;
    } ): Promise<void> {
        await firstValueFrom( this.clientDeviceTokenApi.apiPushdeviceTokensdeactivatePost( {
            employee,
            playerId
        } ) );
    }

    /**
     * Деактивация при логауте
     */
    public async deactivate(): Promise<void> {
        // 1. Деактивируем токен на бэкенде (пока есть данные)
        if ( this.currentPlayerId && this.currentEmployeeId ) {
            this.deactivateOnBackend( {
                playerId: this.currentPlayerId,
                employee: this.currentEmployeeId
            } );
        }
        // 2. Очищаем локальное состояние
        this.currentPlayerId = null;
        this.currentEmployeeId = null;

        try {
            await this.optOut();
        } catch ( error ) {
            console.error( error );
        }

        try {
            await this.logout();
        } catch ( error ) {
            console.error( error );
        }
    };

    private async registerOrTouchOnBackend( { employee, playerId }: {
        employee: string;
        playerId: string;
    } ): Promise<void> {
        try {
            await firstValueFrom( this.clientDeviceTokenApi.apiPushdeviceTokensPost( {
                platform: this.platform,
                employee: employee,
                token: playerId
            } ) );
        } catch ( error: unknown ) {
            console.error( error );
        }
    }
}
