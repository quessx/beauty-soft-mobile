import { ChangeDetectionStrategy, Component, ContentChild, OnInit, TemplateRef, inject, ElementRef, Renderer2, AfterViewInit, InputSignal, input, computed, Signal } from '@angular/core';
import { HeaderOfWindowComponent } from "../header-of-window/header-of-window.component";
import { BodyInPageComponent } from "../body-in-page/body-in-page.component";
import { NgTemplateOutlet } from '@angular/common';
import { BackIconComponent } from '@icons/back-icon';
import { Router, ActivatedRoute } from '@angular/router';
import { OutletAnimationConfig, RouteDataWithOutletAnimation } from '@lib/animations';
import { BasePageTypes } from './types/base-pages.types';

@Component({
    selector: 'base-page',
    templateUrl: './base-page.component.html',
    styleUrls: ['./base-page.component.scss'],
    imports: [HeaderOfWindowComponent, BodyInPageComponent, NgTemplateOutlet, BackIconComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class]': 'cssClasses()'
    }
})
export class BasePageComponent implements OnInit, AfterViewInit {
    public type: InputSignal<BasePageTypes.TBasePageType> = input<BasePageTypes.TBasePageType>(BasePageTypes.TBasePageType.Default);
    private router: Router = inject( Router );
    private activatedRoute: ActivatedRoute = inject( ActivatedRoute );
    private elementRef: ElementRef = inject( ElementRef );
    private renderer: Renderer2 = inject( Renderer2 );

    @ContentChild('header', { static: true }) header!: TemplateRef<any>;
    @ContentChild('firstSectionHeader', { static: true }) firstSectionHeader!: TemplateRef<any>;
    @ContentChild('secondSectionHeader', { static: true }) secondSectionHeader!: TemplateRef<any>;
    @ContentChild('thirdSectionHeader', { static: true }) thirdSectionHeader!: TemplateRef<any>;

    protected cssClasses: Signal<string> = computed(() => {
        return `${ this.type() }`;
    });

    constructor() { }

    ngAfterViewInit() {}

    ngOnInit(): void {
        // Проверяем, нужна ли анимация для этой страницы
        this.checkAndApplyOutletAnimation();
    }

    /**
     * Проверяет конфигурацию роута и применяет анимацию если нужно
     */
    private checkAndApplyOutletAnimation(): void {
        const routeData: RouteDataWithOutletAnimation = this.activatedRoute.snapshot.data;
        const outletAnimation: OutletAnimationConfig | undefined = routeData?.outletAnimation;

        if ( outletAnimation?.enabled ) {
            this.applySlideInAnimation( outletAnimation );
        }
    }

    /**
     * Применяет slide-in анимацию к компоненту
     */
    private applySlideInAnimation( config: OutletAnimationConfig ): void {
        const hostElement: HTMLElement = this.elementRef.nativeElement;
        const duration: number = config.duration || 300;
        const easing: string = config.easing || 'ease-out';
        
        // Устанавливаем начальное состояние (справа за экраном)
        this.renderer.setStyle( hostElement, 'transition', `transform ${duration}ms ${easing}` );
        
        // Запускаем анимацию через небольшую задержку
        setTimeout( () => {
            this.renderer.setStyle( hostElement, 'transform', 'translateX(0)' );
            
            // Убираем transition после завершения анимации
            setTimeout( () => {
                this.renderer.removeStyle( hostElement, 'transition' );
            }, duration );
        }, 10 );
    }

    /**
     * Применяет slide-out анимацию перед закрытием
     */
    private applySlideOutAnimation( config: OutletAnimationConfig ): Promise<void> {
        return new Promise( ( resolve ) => {
            const hostElement: HTMLElement = this.elementRef.nativeElement;
            const duration: number = config.duration || 300;
            const easing: string = config.easing || 'ease-out';
            
            // Устанавливаем transition
            this.renderer.setStyle( hostElement, 'transition', `transform ${duration}ms ${easing}` );
            
            // Запускаем анимацию выезда вправо
            setTimeout( () => {
                this.renderer.setStyle( hostElement, 'transform', 'translateX(100%)' );
                
                // Ждем завершения анимации
                setTimeout( () => {
                    resolve();
                }, duration );
            }, 10 );
        } );
    }

    backEvent(): void {
        // Проверяем, открыта ли страница в named outlet
        if ( this.isInNamedOutlet() ) {
            // Проверяем, нужна ли анимация при закрытии
            const routeData: RouteDataWithOutletAnimation = this.activatedRoute.snapshot.data;
            const outletAnimation: OutletAnimationConfig | undefined = routeData?.outletAnimation;
            
            if ( outletAnimation?.enabled ) {
                // Сначала анимация, потом закрытие
                this.applySlideOutAnimation( outletAnimation ).then( () => {
                    this.closeAllOutlets();
                } );
            } else {
                // Закрываем без анимации
                this.closeAllOutlets();
            }
        } else {
            // Обычный переход назад
            window.history.back();
        }
    }

    /**
     * Проверяет, загружена ли текущая страница в named outlet
     */
    private isInNamedOutlet(): boolean {
        const currentUrl: string = this.router.url;
        
        // Проверяем наличие синтаксиса outlet в URL: (outlet-name:route)
        const outletPattern: RegExp = /\([^)]+:[^)]+\)/;
        const hasNamedOutlet: boolean = outletPattern.test( currentUrl );
        
        // Дополнительно проверяем через ActivatedRoute
        const outletName: string | null = this.activatedRoute.outlet;
        const isInOutlet: boolean = outletName !== 'primary';
        
        return hasNamedOutlet || isInOutlet;
    }

    /**
     * Закрывает все named outlets
     */
    private closeAllOutlets(): void {
        // Получаем список всех известных outlets
        const knownOutlets: string[] = ['right-page']; // Добавьте другие outlets если есть
        
        // Создаем объект для закрытия всех outlets
        const outletsToClose: { [key: string]: null } = {};
        knownOutlets.forEach( ( outletName: string ) => {
            outletsToClose[outletName] = null;
        } );
        
        // Навигация для закрытия outlets
        this.router.navigate( [{ outlets: outletsToClose }], { 
            skipLocationChange: true 
        } );
    }

}
