import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, EventEmitter, inject, Input, Output, Renderer2 } from '@angular/core';
import { AppointmentDetailsWidgetComponent, TStateDetails } from '@widgets/appointment-details-widget';
import { auditTime, catchError, combineLatestAll, distinctUntilChanged, filter, forkJoin, from, fromEvent, merge, Observable, of, pairwise, switchMap, throwError, timer } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ElementActionsWrapperService } from '@ui/wrappers/actions-wrapper/services/element-actions-wrapper.service';
import { map, takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'bsm-appointment-details',
    imports: [ AppointmentDetailsWidgetComponent ],
    templateUrl: './appointment-details.component.html',
    styleUrl: './appointment-details.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class AppointmentDetailsComponent {
    @Input() state: TStateDetails = 'services';
    @Output() public swipe: EventEmitter<void> = new EventEmitter<void>();
    private elementRef: ElementRef = inject( ElementRef );
    private renderer: Renderer2 = inject( Renderer2 );
    private destroyRef: DestroyRef = inject( DestroyRef );
    private _isScrollStableAtTop: boolean = false;
    private readonly _scrollZeroDelay: number = 320; // ms
    private elementActionsWrapper: ElementActionsWrapperService = inject( ElementActionsWrapperService );

    constructor() {
        const scroll$: Observable<number | undefined> = toObservable( this.elementActionsWrapper.scrollTop ).pipe( takeUntilDestroyed( this.destroyRef ) );

        scroll$.pipe(
            map( ( v: number | undefined ): number => ( typeof v === 'number' ? v : 0 ) ),
            map( ( n: number ): boolean => n === 0 ),
            distinctUntilChanged(),
            takeUntilDestroyed(),
            switchMap( ( isZero: boolean ) => {
                if ( isZero ) {
                    return timer( this._scrollZeroDelay ).pipe( map( (): boolean => true ), takeUntil( scroll$.pipe( filter( ( v: number | undefined ) => typeof v === 'number' && v !== 0 ) ) ) );
                }
                return of( false );
            } ),
        ).subscribe( ( stable: boolean ) => {
            this._isScrollStableAtTop = stable;
        } );
        this.initializeSwipeHandling();
    }

    private initializeSwipeHandling(): void {
        const hostEl: HTMLElement = this.elementRef.nativeElement;

        const startPosition: number = hostEl.getBoundingClientRect().y;
        let changedPosition: number = startPosition;
        const baseDuration: number = 300;

        this.elementActionsWrapper.actionsWrapperRef()
        let actionsWrapperRef: ElementRef | undefined = this.elementActionsWrapper.actionsWrapperRef()
        if ( !actionsWrapperRef || !actionsWrapperRef.nativeElement ) {
            return;
        }
        merge( fromEvent( hostEl, 'touchmove', { passive: true } ), fromEvent( hostEl, 'touchend', { passive: true } ) ).pipe(
            takeUntilDestroyed( this.destroyRef ),
            auditTime( 5 ),
            filter( ( event: Event ): event is TouchEvent => event instanceof TouchEvent ),
            pairwise(),
        ).subscribe( ( ev: [ TouchEvent, TouchEvent ] ) => {
            const prev: TouchEvent = ev[ 0 ];
            const next: TouchEvent = ev[ 1 ];

            if ( prev.type === 'touchmove' && next.type === 'touchmove' ) {
                // Find nearest scrollable ancestor of the touch target
                const targetEl: Element = ( next.target instanceof Element ? next.target : hostEl );
                const scrollable: HTMLElement | null = this.findScrollableAncestor( targetEl instanceof HTMLElement ? targetEl : hostEl, hostEl );
                if ( scrollable && this.isAtTopScroll() ) {
                    const _changedPosition: number = changedPosition + ( ev[ 1 ].targetTouches[ 0 ].clientY - ev[ 0 ].targetTouches[ 0 ].clientY );
                    if ( _changedPosition >= startPosition ) {
                        changedPosition = _changedPosition;
                        this.renderer.setStyle( actionsWrapperRef?.nativeElement, 'transform', `translateY(${ changedPosition - startPosition }px)` );
                    }
                }
            } else if ( ev[ 0 ].type !== 'touchend' && this.isAtTopScroll() ) {
                const currentTranslateY: number = changedPosition - startPosition;

                if ( changedPosition - startPosition < 150 ) {
                    const duration: number = Math.abs( currentTranslateY ) / 0.6;
                    actionsWrapperRef?.nativeElement.animate(
                        [
                            { transform: 'translateY(0)' }
                        ],
                        { duration: duration, fill: 'none' }
                    ).finished.finally( () => {
                        changedPosition = startPosition;
                        this.renderer.setStyle( actionsWrapperRef.nativeElement, 'transform', 'translateY(0)' );
                    } );
                } else {
                    const totalDistance: number = document.body.clientHeight - startPosition;
                    const remainingDistance: number = totalDistance - currentTranslateY;
                    const duration: number = Math.max( ( remainingDistance / totalDistance ) * baseDuration, 100 );

                    const contAnim: Promise<Animation> = actionsWrapperRef?.nativeElement.animate( [
                        { transform: 'translateY(100%)' }
                    ], { duration: duration, fill: 'forwards' } ).finished;
                    const parentAnim: Promise<Animation> = ( actionsWrapperRef?.nativeElement.parentElement || actionsWrapperRef.nativeElement ).animate( [
                        { opacity: 0 }
                    ], { duration: duration, fill: 'forwards' } ).finished;
                    forkJoin( [ from( contAnim ), from( parentAnim ) ] ).subscribe( () => {
                        this.onCloseWrapper();
                    } );
                }
            }
        } );
    }

    private onCloseWrapper(): void {
        this.elementActionsWrapper.setOnCloseWrapper();
    }

    private findScrollableAncestor( el: HTMLElement | null, root: HTMLElement ): HTMLElement | null {
        let current: HTMLElement | null = el;
        while ( current && current !== root && current !== document.body ) {
            try {
                if ( current.scrollHeight > current.clientHeight ) {
                    return current;
                }
            } catch ( e ) {
                // ignore
            }
            current = current.parentElement;
        }
        return root;
    }

    private isAtTopScroll(): boolean {
        // Require the scroll-top to be stable at 0 for a short debounce delay to avoid
        // immediately closing the modal on brief touches or micro-movements.
        return this._isScrollStableAtTop;
    }
}
