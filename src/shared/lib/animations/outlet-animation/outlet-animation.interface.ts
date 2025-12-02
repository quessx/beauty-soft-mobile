/**
 * Интерфейс для конфигурации анимаций outlet
 */

export interface OutletAnimationConfig {
    enabled: boolean;
    type: 'slide-in' | 'fade-in' | 'zoom-in';
    direction?: 'from-right' | 'from-left' | 'from-top' | 'from-bottom';
    duration?: number;
    easing?: string;
}

export interface RouteDataWithOutletAnimation {
    animation?: string;
    outletAnimation?: OutletAnimationConfig;
    [key: string]: any;
}