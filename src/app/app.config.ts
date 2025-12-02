import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, isDevMode, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { APP_API } from '@api/api.token';
import { headersInterceptor } from '@lib/interceptors/header';
import { routes } from '@routes/index';
import { provideNgxMask } from 'ngx-mask';
import { environment } from '@environment/environment';
import { ApiModule, Configuration } from '@api/index';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { providePushNotifications } from '@lib/services/push-notifications';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { primePreset } from '@app/preset';

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: APP_API, useValue: environment.apiUrl },
        provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([headersInterceptor]), withFetch()),
        provideAnimations(),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: primePreset,
                options: {
                    prefix: 'p',
                    darkModeSelector: false || 'none',
                    cssLayer: false
                }
            },
        }),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),
        importProvidersFrom(ApiModule.forRoot(() => {
            return new Configuration({
                basePath: environment.apiUrl
            });
        })),
        provideNgxMask({
            validation: true,
            dropSpecialCharacters: false
        }),

        provideIonicAngular({}),
        // Динамический провайдер push-уведомлений в зависимости от платформы
        ...providePushNotifications()
    ]
};
