import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { App, AppLaunchUrl } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import moment from 'moment';
import 'moment/locale/ru';

@Component( {
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class AppComponent implements OnInit {
    public title: string = 'beauty-soft-mobile';

    public constructor ( private router: Router ) {
        moment.locale( 'ru' );
    }

    public ngOnInit (): void {
        this.initializeApp();
    }

    private async initializeApp (): Promise<void> {
        if ( Capacitor.isNativePlatform() ) {
            // Обработчик App Links для push-уведомлений
            App.addListener( 'appUrlOpen', ( event ) => {
                console.log( '🔗 App URL opened:', event.url );
                this.handleAppLink( event.url );
            } );

            // Обработка URL при запуске приложения
            const result: AppLaunchUrl | undefined = await App.getLaunchUrl();
            if ( result && result.url ) {
                console.log( '🚀 App launched with URL:', result.url );
                this.handleAppLink( result.url );
            }
        }
    }

    private handleAppLink ( url: string ): void {
        try {
            // Парсим URL: http://localhost:4200/crm/booking/appointment/ID/details
            const urlObj: URL = new URL( url );
            
            // Извлекаем путь после localhost:4200
            const path: string = urlObj.pathname;
            console.log( '🧭 Navigating to path:', path );
            
            // Переходим по маршруту в Angular Router
            this.router.navigateByUrl( path );
        } catch ( error ) {
            console.error( '❌ Failed to handle app link:', error );
        }
    }

    // Disable context menu
    @HostListener('document:contextmenu', ['$event'])
    onContextmenu(e: MouseEvent) {
        const target: HTMLElement | null = e.target as HTMLElement | null;
        if (!target) return;
        if (target.closest && target.closest('a')) {
            e.preventDefault();
        }
    }
    @HostListener('document:selectstart', ['$event'])
    onSelectstart(e: Event) {
        const target: HTMLElement | null = e.target as HTMLElement | null;
        if (!target) return;
        if (target.closest && target.closest('a')) {
            e.preventDefault();
        }
    }
}
