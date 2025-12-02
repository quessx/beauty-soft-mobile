import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { GetResult, Preferences } from '@capacitor/preferences';
import { TUserAccount } from '@entities/user-account';
import { environment } from '@environment/environment';
import moment from 'moment';
import { catchError, exhaustMap, forkJoin, from, map, Observable, of, switchMap, throwError, take, shareReplay, finalize } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { TOauth2Response, TParsedToken } from './types';
import { PhoneAuthChallengeLogoutInputJsonldPhoneAuthLogoutWrite, PhoneAuthChallengeRefreshTokenOutputJsonldPhoneAuthRefreshRead, PhoneAuthChallengeService } from '@api/index';
import { mapResponse, tapResponse } from '@ngrx/operators';

@Injectable( {
    providedIn: 'root'
} )
export class AuthService {
    public isWeb: boolean = Capacitor.getPlatform() === 'web';
    public isIos: boolean = Capacitor.getPlatform() === 'ios';
    public isAndroid: boolean = Capacitor.getPlatform() === 'android';
    public redirectUrl: string = window.location.origin + '/crm';
    private storageName: string = environment.storageName;
    private format: string = 'YYYY/MM/DD/HH/mm';
    private expiresKey: string = 'expires_date';
    private apiService: PhoneAuthChallengeService = inject(PhoneAuthChallengeService);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private refreshTokenRequest$: Observable<void> | null = null;

    constructor(
        private router: Router,
        private loc: Location
    ) {
    }

    authorize(): void {
        this.checkMagicLinkCode().subscribe({
            next: () => {
                // Если magic link код успешно обработан - переходим в CRM
                this.router.navigate(['crm']);
            },
            error: () => {
                // Если ошибка или нет кода - переходим на регистрацию
                this.router.navigate(['registration']);
            }
        });
    }

    checkAuth(): Observable<void> {
        return this.getItem( 'refresh_token' ).pipe(
            exhaustMap( ( prevRefreshToken: string | null ) => {
                if ( !!prevRefreshToken ) {
                    return this.refreshToken( prevRefreshToken );
                } else {
                    return throwError( () => null );
                }
            } )
        );
    }

    checkMagicLinkCode(): Observable<void> {
        // Получаем code из URL параметров
        const queryString: string = window.location.search; 
        const urlParams: URLSearchParams = new URLSearchParams(queryString); 

        // 3. Используем метод get() для получения значения конкретного параметра
        const code: string | null = urlParams.get('code');
        
        if (!code) {
            return throwError(() => new Error('No code parameter found in URL'));
        }

        const params: URLSearchParams = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('client_id', 'front');
        params.append('redirect_uri', window.location.origin);

        return fromFetch(`${environment.authority}/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        }).pipe(
            exhaustMap((response: Response) => {
                if (!response.ok) {
                    return throwError(() => null);
                }
                return this.saveResponse(response);
            })
        );
    }

    requestTokenDirectAccess( email: string, pswrd: string ): Observable<void> {
        const params = new URLSearchParams();
        params.append( 'grant_type', 'password' );
        params.append( 'client_id', 'front' );
        params.append( 'username', email );
        params.append( 'password', pswrd );
        params.append( 'scope', 'openid profile email offline_access organization' );

        return fromFetch( `${environment.authority}/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        } ).pipe(
            exhaustMap( ( value: Response ) => {
                return this.saveResponse( value );
            } )
        );
    }

    logout(): void {
        const clearAndAuth: Function = () => {
            this.clearStorage().finally( () => {
                this.router.navigate( ['registration'] );
            } );
        };
        
        this.getItem( 'refresh_token' ).subscribe( ( refreshToken: string | null ) => {
            if ( !refreshToken ) {
                clearAndAuth();
                return;
            }

            if ( this.isFrontToken(refreshToken) ) {
                const params = new URLSearchParams();
                params.append( 'client_id', 'front' );
                params.append( 'refresh_token', refreshToken );

                fetch( `${environment.authority}/protocol/openid-connect/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: params
                } ).finally( () => {
                    clearAndAuth();
                } );
                return;
            }

            let data: PhoneAuthChallengeLogoutInputJsonldPhoneAuthLogoutWrite = {
                refreshToken: refreshToken,
            };

            this.apiService.apiPublicphoneAuthlogoutPost(data).pipe(
                take(1),
                catchError( () => of( null ) )
            ).subscribe( () => {
                clearAndAuth();
            } );
        } );
    };

    private getItem( id: keyof TOauth2Response ): Observable<string | null> {
        const storage: Promise<GetResult> = Preferences.get( { key: this.storageName } );
        return from( storage ).pipe( map( ( storage: GetResult ) => {
            if ( !storage.value ) {
                return null;
            }
            const item: string | number = JSON.parse( storage.value )[id];
            return item.toString();
        } ) );
    }

    private refreshFrontToken( refreshToken: string ): Observable<void> {
        const params = new URLSearchParams();
        params.append( 'grant_type', 'refresh_token' );
        params.append( 'refresh_token', refreshToken );
        params.append( 'client_id', 'front' );
        params.append( 'scope', 'openid profile email offline_access organization' );

        return fromFetch( `${environment.authority}/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        } ).pipe(
            exhaustMap( ( response: Response ) => {
                if ( response.ok ) {
                    return this.saveResponse( response );
                } else {
                    return throwError( () => new Error( 'Failed to refresh token' ) );
                }
            } ),
            catchError( ( error ) => {
                this.clearStorage().finally( () => { this.router.navigate( ['registration'] ); } );
                return throwError( () => error );
            } )
        );
    }

    private refreshToken( refreshToken: string ): Observable<void> {
        // Если уже есть активный запрос на обновление токена, возвращаем его
        if ( this.refreshTokenRequest$ ) {
            return this.refreshTokenRequest$;
        }

        // Создаем новый запрос на обновление токена
        if ( this.isFrontToken( refreshToken ) ) {
            this.refreshTokenRequest$ = this.refreshFrontToken( refreshToken );
        } else {
            this.refreshTokenRequest$ = this.apiService.apiPublicphoneAuthrefreshPost( { refreshToken } ).pipe(
                tapResponse( 
                    ( response: PhoneAuthChallengeRefreshTokenOutputJsonldPhoneAuthRefreshRead ) => {
                        if ( response ) {
                            let tokens: TOauth2Response = { 
                                access_token: response.access_token || '',
                                expires_in: response.expires_in || 0,
                                refresh_expires_in: response.refresh_expires_in || 0,
                                refresh_token: response.refresh_token || '',
                                token_type: response.token_type || '',
                                'not-before-policy': response['not-before-policy'] || 0,
                                session_state: response.session_state || '',
                                scope: response.scope || '',
                                id_token: ''
                            };
                            this.saveTokens( tokens );
                        }
                    }, () => { 
                        this.clearStorage().finally( () => { 
                            this.router.navigate( ['registration'] ); 
                        } ) 
                    } 
                ),
                catchError( () => {
                    this.clearStorage().finally( () => { this.router.navigate( ['registration'] ); } );
                    return throwError( () => null );
                } ),
                map( () => { } )
            );
        }

        // Используем shareReplay для кеширования результата и finalize для очистки кеша
        this.refreshTokenRequest$ = this.refreshTokenRequest$.pipe(
            shareReplay( 1 ),
            finalize( () => {
                // Очищаем кеш после завершения запроса (успешного или с ошибкой)
                this.refreshTokenRequest$ = null;
            } )
        );

        return this.refreshTokenRequest$;
    }

    getTokenOrRefresh() {
        return from( Preferences.get( { key: 'expires_date' } ) ).pipe( exhaustMap( ( date: GetResult ) => {
            if ( date.value ) {
                if ( moment( date.value, this.format ).diff( moment(), 'minutes' ) < 5 ) {
                    return this.getItem( 'refresh_token' ).pipe( exhaustMap( ( refreshToken: string | null ) => {
                        if ( refreshToken ) {
                            return this.refreshToken( refreshToken ).pipe( exhaustMap( () => {
                                return this.getItem( 'access_token' );
                            } ) );
                        } else {
                            return of( null );
                        }
                    } ) );
                } else {
                    return this.getItem( 'access_token' );
                }
            } else {
                return of( null );
            }
        } ) );
    }

    getAccessToken() {
        return this.getItem( 'access_token' );
    }

    private clearStorage(): Promise<void> {
        return Preferences.remove( { key: this.storageName } );
    }

    private saveResponse( response: Response ): Observable<void> {
        if ( response.ok ) {
            return from( response.json() ).pipe(
                exhaustMap( ( data: TOauth2Response ) => {
                    const setAuth: Promise<void> = Preferences.set( { key: this.storageName, value: JSON.stringify( data ) } );
                    const setExp: Promise<void> = Preferences.set( { key: this.expiresKey, value: moment().add( data.expires_in, 'seconds' ).format( this.format ) } );
                    return this.saveTokens(data);
                } )
            );
        } else {
            return throwError( () => null );
        }
    }

    public saveTokens(tokens: TOauth2Response): Observable<void> {
        const setAuth: Promise<void> = Preferences.set( { key: this.storageName, value: JSON.stringify( tokens ) } );
        const setExp: Promise<void> = Preferences.set( { key: this.expiresKey, value: moment().add( tokens.expires_in, 'seconds' ).format( this.format ) } );
        return forkJoin( [from( setAuth ), from( setExp )] ).pipe( map( () => { } ) );
    }

    getUserInfo(): Observable<TUserAccount> {
        return this.getItem( 'access_token' ).pipe(
            exhaustMap( ( token: string | null ) => {
                if ( !token ) {
                    return throwError( () => null );
                }
                return fromFetch( `${environment.authority}/protocol/openid-connect/userinfo`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                } ).pipe( exhaustMap( ( response: Response ) => {
                    if ( !response.ok ) {
                        return throwError( () => null );
                    }
                    return from( response.json() ).pipe(
                        exhaustMap( ( data: TUserAccount ) => {
                            return of( data );
                        } )
                    );
                } ) );
            } )
        );
    }

    private isFrontToken(token: string): boolean {
        let parsed: TParsedToken | null = this.parseRefreshToken(token);
        if (!parsed) {
            return false;
        }
        return parsed.azp !== 'main';
    }

    private parseRefreshToken( refreshToken: string ): TParsedToken | null {
        try {
            // JWT токен состоит из трех частей: header.payload.signature
            const parts: string[] = refreshToken.split( '.' );
            
            if ( parts.length !== 3 ) {
                console.warn( 'Invalid JWT token format' );
                return null;
            }

            // Декодируем payload (вторая часть)
            const payload: string = parts[1];
            
            // Добавляем padding если необходимо для корректного base64 декодирования
            const paddedPayload: string = payload + '='.repeat( ( 4 - payload.length % 4 ) % 4 );
            
            // Декодируем base64
            const decodedPayload: string = atob( paddedPayload );
            
            // Парсим JSON
            const parsedPayload: any = JSON.parse( decodedPayload );
            
            return parsedPayload;
        } catch ( error ) {
            console.error( 'Error parsing refresh token:', error );
            return null;
        }
    }
}