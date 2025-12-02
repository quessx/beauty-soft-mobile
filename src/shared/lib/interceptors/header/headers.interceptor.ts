import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { IOrganizationStore, OrganizationStore } from '@entities/organization';
import { AuthService } from '@lib/services/auth';
import { DefaultOverlayService } from '@lib/services/default-overlay';
import { ReqStatusService } from '@lib/services/req-status';
import { InformationPopupService } from '@ui/popups/information-popup';
import { catchError, finalize, mergeMap, of, retryWhen, Subscription, switchMap, take, tap, throwError, timer } from 'rxjs';

const maxRetries = 5;
const retryDelays: number[] = [2000, 4000, 8000, 16000, 32000];
let timerSub: Subscription | null = null;

/**
 * API роуты, связанные с публичными страницами (auth, registration)
 * Для этих роутов не требуется загрузка организаций
 */
const PUBLIC_API_ROUTES: readonly string[] = [
    '/api/auth',
    '/api/public',
    '/api/registration', 
    '/api/phone_auth_challenges',
    '/api/organizations', // создание организаций при регистрации
    '/api/employees' // создание администратора при регистрации
] as const;

/**
 * Публичные фронтенд роуты из src/routes/public
 * На этих страницах не требуется загрузка организаций
 */
const PUBLIC_FRONTEND_ROUTES: readonly string[] = [
    '/auth',
    '/registration'
] as const;

export const headersInterceptor: HttpInterceptorFn = ( req, next ) => {
    const reqStatusService: ReqStatusService = inject( ReqStatusService );
    reqStatusService.emitReqStatus();
    let retryCount: number = 0;
    const organizationStore: IOrganizationStore = inject( OrganizationStore );
    const defaultOverlayService: DefaultOverlayService = inject( DefaultOverlayService );
    const informationPopupService: InformationPopupService = inject( InformationPopupService );
    const router: Router = inject( Router );

    return modifyRequest( req ).pipe(
        catchError( error => {
            return throwError( () => error );
        } ),
        switchMap( ( modifiedReq ) =>
            next( modifiedReq ).pipe(
                retryWhen( errors =>
                    errors.pipe(
                        mergeMap( ( error, index ) => {
                            if ( error instanceof HttpErrorResponse && ( error.status === 429 || error.status === 503 || error.status === 0 ) ) {
                                if ( retryCount < maxRetries ) {
                                    if ( error.status === 429 ) {
                                        defaultOverlayService.show();
                                        timerSub?.unsubscribe();
                                        timerSub = timer( 1500 ).subscribe( defaultOverlayService.hide );
                                    }
                                    retryCount++;
                                    const delay: number = retryDelays[Math.min( index, retryDelays.length - 1 )];
                                    return timer( delay );
                                } else {
                                    return throwError( () => error );
                                }
                            }
                            return throwError( () => error );
                        } ),
                        take( maxRetries )
                    )
                ),
                tap( () => {
                    retryCount = 0;
                    if ( !organizationStore.getSelectedOrganization() && 
                         !isPublicRoute( req.url ) && 
                         !isPublicPage( router.url ) ) {
                        organizationStore.loadByFilter();
                    }
                } ),
                catchError( error => {
                    if ( [422].includes( error.status ) ) {
                        const title: string | undefined = error['error']?.['title'];
                        const description: string | undefined = error['error']?.['description'];
                        if ( title && description ) {
                            informationPopupService.hide().show( title, description, false );
                        }
                    }
                    return throwError( () => error );
                } ),
                finalize( () => {
                    reqStatusService.emitRespStatus();
                } )
            )
        )
    );
};

function modifyRequest(
    request: HttpRequest<unknown>,
) {
    // Не модифицируем запрос для refresh токена
    if (request.url.includes('main/public/phone-auth/refresh')) {
        return of(request);
    }

    const authService: AuthService = inject( AuthService );
    return authService.getTokenOrRefresh().pipe(
        switchMap( ( token: string | null ) => {
            if ( token ) {
                const authRequest: HttpRequest<unknown> = request.clone( {
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                } );
                return of( authRequest );
            } else {
                return of( request );
            }
        } ),
        catchError( error => {
            return throwError( () => error );
        } )
    );
}

/**
 * Проверяет является ли API маршрут публичным
 * @param url - URL API запроса
 * @returns true если API маршрут связан с публичными страницами
 */
function isPublicRoute( url: string ): boolean {
    return PUBLIC_API_ROUTES.some( ( route: string ) => url.includes( route ) );
}

/**
 * Проверяет находится ли пользователь на публичной странице
 * @param currentUrl - текущий URL фронтенда (router.url)
 * @returns true если пользователь на публичной странице
 */
function isPublicPage( currentUrl: string ): boolean {
    return PUBLIC_FRONTEND_ROUTES.some( ( route: string ) => currentUrl.startsWith( route ) );
}
