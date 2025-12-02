import { Component, DestroyRef, ElementRef, input, Input, InputSignal, OnInit, output, OutputEmitterRef, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArrowDownIconComponent } from '@icons/arrow-down-icon';
import { HeaderButtonComponent } from '@ui/buttons/header-button';
import { TextComponent } from '@ui/text';
import { LanguageService, TranslatePipe } from 'beauty-soft-common';
import { auditTime, filter, forkJoin, from, fromEvent, merge, Observable, pairwise } from 'rxjs';
import { langData } from './lang';
import { TLeftAction, TRightAction } from './types';
import { SkeletonComponent } from './ui/skeleton/skeleton.component';

@Component( {
    selector: 'bsm-wrapper',
    templateUrl: './wrapper.component.html',
    styleUrls: ['./wrapper.component.scss'],
    imports: [ArrowDownIconComponent, TranslatePipe, TextComponent, HeaderButtonComponent, SkeletonComponent],
} )
export class WrapperComponent implements OnInit {
    private baseDuration: number = 300;
    @Input() public rightActionHandler?: () => ( Observable<unknown> | void );
    public actionVariants: InputSignal<[TLeftAction, TRightAction]> = input<[TLeftAction, TRightAction]>( ['close', 'save'] );
    public centerText: InputSignal<string> = input( '' );
    public closeOnRighAction: InputSignal<boolean> = input( true );
    public isLoaded: InputSignal<boolean> = input.required();
    public leftAction: OutputEmitterRef<void> = output();
    public rightAction: OutputEmitterRef<void> = output();
    public swipeAction: OutputEmitterRef<void> = output();
    public error: OutputEmitterRef<unknown> = output();

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private ren: Renderer2,
        private destroyRef: DestroyRef,
    ) {
        LanguageService.setLangData( langData[LanguageService.getLangStatic()] );
    }

    private closeFn: () => Observable<[Animation, Animation]> = () => {
        const parentAnim: Promise<Animation> = ( this.elementRef.nativeElement.parentElement || this.elementRef.nativeElement ).animate( [
            { opacity: 0 }
        ], {
            duration: this.baseDuration,
            fill: 'forwards'
        } ).finished;

        const wrapperAnim: Promise<Animation> = this.elementRef.nativeElement.animate( [
            { transform: 'translateY(100%)' }
        ], {
            duration: this.baseDuration,
            fill: 'forwards'
        } ).finished;

        return forkJoin( [from( wrapperAnim ), from( parentAnim )] );
    };


    protected onLeftAction(): void {
        if ( this.actionVariants()[0] === 'close' ) {
            this.closeFn().subscribe( () => {
                this.leftAction.emit();
            } );
        } else {
            this.leftAction.emit();
        }
    }

    protected onRightAction(): void {
        const closeOrEmit: Function = () => {
            if ( this.closeOnRighAction() ) {
                this.closeFn().subscribe( () => {
                    this.rightAction.emit();
                } );
            } else {
                this.rightAction.emit();
            }
        };
        const handler: void | Observable<unknown> | undefined = this.rightActionHandler?.call( null );

        if ( handler ) {
            handler.subscribe( {
                error: ( error: unknown ) => {
                    this.error.emit( error );
                },
                next: () => {
                    closeOrEmit();
                }
            } );

        } else {
            closeOrEmit();
        }
    };

    ngOnInit(): void {
        const switchOverflowY: ( value: 'hidden' | 'auto', scrollable: Element | null ) => void = ( value: 'hidden' | 'auto', scrollable: Element | null ) => {
            if ( scrollable ) {
                this.ren.setStyle( scrollable, 'overflowY', value );
            }
        };
        const startRect: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();
        let changedPosition: number = startRect.y;
        let missingCheck: boolean = true;

        merge(
            fromEvent( this.elementRef.nativeElement, 'touchmove', { passive: true } ),
            fromEvent( this.elementRef.nativeElement, 'touchend', { passive: true } ),
        ).pipe(
            takeUntilDestroyed( this.destroyRef ),
            auditTime( 5 ),
            filter( ( event: Event ): event is TouchEvent => event instanceof TouchEvent ),
            pairwise(),
        ).subscribe( ( ev: [TouchEvent, TouchEvent] ) => {
            const scrollable: Element | null = ev[1].target instanceof HTMLElement ? ev[1].target.closest( '.wscroll' ) : null;

            if ( ( !!scrollable?.scrollTop ) ) {
                missingCheck = false;
                return;
            } else if ( ev[1].type === 'touchend' || ev[0].type === 'touchend' ) {
                missingCheck = true;
            }

            if ( !scrollable ) {
                missingCheck = true;
            }

            if ( ev[0].type === 'touchmove' && ev[1].type === 'touchmove' && missingCheck ) { // moving
                const _changedPosition: number = changedPosition + ( ev[1].targetTouches[0].clientY - ev[0].targetTouches[0].clientY );
                if ( _changedPosition >= startRect.y ) {
                    changedPosition = _changedPosition;
                    this.ren.setStyle( this.elementRef.nativeElement, 'transform', `translateY(${changedPosition - startRect.y}px)` );
                    switchOverflowY( 'hidden', scrollable );
                }
            } else if ( ev[0].type !== 'touchend' ) {
                const currentTranslateY: number = changedPosition - startRect.y;

                if ( changedPosition - startRect.y < 150 ) { // return position
                    const duration: number = Math.abs( currentTranslateY ) / 0.6;
                    this.elementRef.nativeElement.animate(
                        [
                            { transform: 'translateY(0)' }
                        ],
                        { duration: duration, fill: 'none' }
                    ).finished.finally( () => {
                        changedPosition = startRect.y;
                        this.ren.setStyle( this.elementRef.nativeElement, 'transform', 'translateY(0)' );
                        switchOverflowY( 'auto', scrollable );
                    } );
                } else { // start closing
                    const totalDistance: number = document.body.clientHeight - startRect.y;
                    const remainingDistance: number = totalDistance - currentTranslateY;
                    const duration: number = Math.max( ( remainingDistance / totalDistance ) * this.baseDuration, 100 );

                    const contAnim: Promise<Animation> = this.elementRef.nativeElement.animate( [
                        { transform: 'translateY(100%)' }
                    ], { duration: duration, fill: 'forwards' } ).finished;
                    const parentAnim: Promise<Animation> = ( this.elementRef.nativeElement.parentElement || this.elementRef.nativeElement ).animate( [
                        { opacity: 0 }
                    ], { duration: duration, fill: 'forwards' } ).finished;

                    forkJoin( [from( contAnim ), from( parentAnim )] ).subscribe( () => {
                        this.swipeAction.emit();
                    } );
                }
            }
        } );
    }
}
