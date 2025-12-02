import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnInit, Renderer2, signal, Signal, WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { INotificationStore, NotificationStore } from '@entities/notification';
import { IUserAccountStore, UserAccountStore } from '@entities/user-account';
import { NotificationPopupFeatureService } from '@features/notification-popup-feature';
import { NotificationIconComponent } from '@icons/notification-icon';
import { BaseWidget } from '@lib/helpers/base-widget/base-widget.class';
import { AppointmentLogDataService } from '@lib/services/appointment-log';
import { CheckboxComponent } from '@ui/form-elements';
import { CalendarScrollableService, TCalendarDate } from '@ui/popups/calendar-scrollable';
import { INavPanelStore, NavPanelStoreToken, SidebarMobileFeatureComponent, SidebarPopupOptionsFeatureModel, TNavItem, TNavPanelOption, LanguageService } from 'beauty-soft-common';
import moment, { Moment } from 'moment';
import { merge, Observable, take } from 'rxjs';
import { LoadDataService } from './services/load-data.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { langData } from './lang/nav-panel.lang';
import { IPhoneAuthChallengeStore, PhoneAuthChallengeStore } from '@entities/phone-auth-challenge'; // Add the correct import path
import { PhoneAuthChallengeMagicLinkInputJsonldPhoneAuthMagicLinkWrite, PhoneAuthChallengeMagicLinkOutputJsonldPhoneAuthMagicLinkRead } from '@api/index';
import { AuthService } from '@lib/services/auth';
import { environment } from '@environment/environment';
import { IPushNotificationsService, PUSH_NOTIFICATIONS_SERVICE } from '@lib/services/push-notifications';
import { EmployeesStore } from '@entities/employees';
import { IMenuItem } from '@ui/main-menu';
import { getSidebarMenuItems, SidebarMobileRenderFeatureService } from '@features/sidebar-mobile-feature';

@Component( {
    selector: 'beauty-topbar-widget',
    imports: [SidebarMobileFeatureComponent, NotificationIconComponent],
    templateUrl: './topbar-widget.component.html',
    styleUrl: './topbar-widget.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [LoadDataService, NotificationPopupFeatureService, NotificationIconComponent, CheckboxComponent]
} )
export class TopbarWidgetComponent extends BaseWidget implements OnInit {
    private loadDataService: LoadDataService = inject( LoadDataService );
    private userAccountStore: IUserAccountStore = inject( UserAccountStore );
    private pushService: IPushNotificationsService = inject( PUSH_NOTIFICATIONS_SERVICE );
    private navPanelStore: INavPanelStore | null = inject( NavPanelStoreToken, { optional: true } );
    private readonly notificationStore: INotificationStore = inject( NotificationStore );
    private notificationPopupFeatureService: NotificationPopupFeatureService = inject( NotificationPopupFeatureService );
    private dateBtn?: Element;
    private appointmentLogDataService: AppointmentLogDataService = inject(AppointmentLogDataService);
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private router: Router = inject(Router);
    private phoneAuthChallengeStore: IPhoneAuthChallengeStore = inject(PhoneAuthChallengeStore);
    private authService: AuthService = inject(AuthService);
    private magicLink: WritableSignal<string> = signal('');
    private route: ActivatedRoute = inject(ActivatedRoute);

    private sidebarRenderService: SidebarMobileRenderFeatureService = inject(SidebarMobileRenderFeatureService);

    private employeesStore = inject(EmployeesStore);

    public sidebarOptions: Signal<SidebarPopupOptionsFeatureModel> = computed( () => {
        return new SidebarPopupOptionsFeatureModel(
            this.notificationStore.isAllNotificationsRead,
            async () => {
                await this.pushService.deactivate();
                this.userAccountStore.logout();
            },
            this.userAccountStore.additionalData()?.fullName || '',
            this.userAccountStore.additionalData()?.avatar?.contentUrl || '',
            this.navPanelStore,
            moment().format( 'D MMMM, dd' ),
            undefined,
            'avatar.svg',
            'logo.svg',
            this.getNavPanelItems(),
        );
    } );

    constructor( private elementRef: ElementRef<HTMLElement>, private calendarService: CalendarScrollableService, private ren: Renderer2 ) {
        super();
        LanguageService.setLangData(langData[LanguageService.getLangStatic()]);
        merge(toObservable(this.appointmentLogDataService.selectedDate), toObservable(this.calendarService.weekDate)).subscribe((selectedDate: TCalendarDate | null) => {
            if (!selectedDate) {
                return;
            }

            this.setDateText( moment( selectedDate ), this.appointmentLogDataService.scheduleState() );
        } );
    }

    private getRedirectUri(): string {
        return environment.returnWebUrl || 'alika-mobile://oauth2redirect';
    }

    private getNavPanelItems(): TNavItem[] {
        const routes: TNavPanelOption[] = this.getValidRoutes();
        let links: TNavItem[] = routes.map((route: TNavPanelOption, index: number) => {
            return {
                text: LanguageService.translate(route.data?.['title'] || ''),
                link: route.path || '',
                sort: index,
                id: route.path || '',
                icon: route.path || '',
                type: 'link',
                options: []
            };
        });

        links = links.filter((link: TNavItem) => !!link.text && !!link.link);

        if (!environment.production) {
            links.push({
                text: LanguageService.translate('nav_items_title.dev_tools'),
                link: '',
                sort: links.length,
                id: 'dev-tools',
                type: 'button',
                options: [],
                callback: () => {
                    // Проверяем, открыт ли уже outlet
                    const currentUrl = this.router.url;
                    if (currentUrl.includes('(right-page:dev-tools)')) {
                        // Закрываем outlet
                        this.router.navigate([{ outlets: { 'right-page': null } }], { 
                            skipLocationChange: true 
                        });
                    } else {
                        // Открываем outlet
                        this.router.navigate([{ outlets: { 'right-page': 'dev-tools' } }], { 
                            skipLocationChange: true 
                        });
                    }
                }
            });
        }

        if (this.userAccountStore.isAdmin()) {
            links.push({
                text: LanguageService.translate('nav_items_title.all_settings'),
                link: '',
                sort: links.length,
                id: 'all-settings',
                icon: 'settings',
                type: 'custom_link',
                signalLink: this.magicLink,
                options: [],
            });
        }

        return links;
    }

    private getValidRoutes(): Route[] {
        const routes = this.activatedRoute.snapshot.routeConfig?.children || this.router.config;
        return routes;
    }

    override ngOnInit(): void {
        super.ngOnInit();
        const dateBtn: Element | null = this.elementRef.nativeElement.querySelector( '.sidebar-mobile-button' );
        if ( !dateBtn ) {
            return;
        }
        this.dateBtn = dateBtn;

        this.ren.listen( dateBtn, 'click', () => {
            this.calendarService.show( this.appointmentLogDataService.selectedDate, this.appointmentLogDataService.scheduleState );
        } );
    }

    override preload(): Observable<boolean> {
        return this.loadDataService.loadData();
    }

    protected onNotificationClick(): void {
        // this.notificationPopupFeatureService.show()
    }

    private setDateText( date: Moment, type: 'week' | 'day' ): void {
        const span: HTMLSpanElement | null | undefined = this.dateBtn?.querySelector( 'span' );
        if ( !span ) {
            return;
        }

        if ( type === 'day' ) {
            this.ren.setProperty( span, 'textContent', date.format( 'D MMMM, dd' ) );
        } else {
            const day: string = date.format( 'MMMM' );
            this.ren.setProperty( span, 'textContent', day.charAt( 0 ).toUpperCase() + day.slice( 1 ) );
        }
    }

    onClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const platform = Capacitor.getPlatform();
        
        // Проверяем клик по SVG с атрибутом beauty-menu-icon
        let isMenuIconClick = false;
        
        // Проверяем сам элемент и его родителей
        let currentElement: HTMLElement | null = target;
        while (currentElement) {
            if (currentElement.tagName.toLowerCase() === 'svg' && 
                currentElement.hasAttribute('beauty-menu-icon')) {
                isMenuIconClick = true;
                break;
            }
            currentElement = currentElement.parentElement;
        }
        
        // Если клик не по beauty-menu-icon SVG, завершаем выполнение
        if (!isMenuIconClick) {
            return;
        }

        const sidebarMenuItems = getSidebarMenuItems();

        const entities: IMenuItem[] = this.employeesStore.entities().map((employee) => ({
            label: employee.name
        }));

        sidebarMenuItems[2].items = entities;

        this.sidebarRenderService.show(
            this.userAccountStore.name() || '',
            this.userAccountStore.additionalData()?.avatar?.contentUrl || '',
            sidebarMenuItems,
            () => {
                console.log(this.userAccountStore.email())
            },
            () => {
                this.router.navigate(['/profile']);
            }
        );
        
        let data: PhoneAuthChallengeMagicLinkInputJsonldPhoneAuthMagicLinkWrite = {
            returnUrl: this.getRedirectUri()
        }
        this.phoneAuthChallengeStore.getMagicLinkAsObservable(data).pipe(take(1)).subscribe((magicLink: PhoneAuthChallengeMagicLinkOutputJsonldPhoneAuthMagicLinkRead) => {
            if (magicLink && magicLink.link) {
                this.magicLink.set(magicLink.link);
            }
        });
    }
}
