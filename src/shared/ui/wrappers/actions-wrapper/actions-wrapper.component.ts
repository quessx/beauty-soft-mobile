import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, DestroyRef, ElementRef, EventEmitter, HostBinding, inject, Input, OnInit, Output, Renderer2, Signal, TemplateRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArrowDownIconComponent } from '@icons/arrow-down-icon';
import { ActionsWrapperClass, TActionsWrapper } from '@ui/wrappers/actions-wrapper/actions-wrapper.types';
import { LanguageService, TranslatePipe } from 'beauty-soft-common';
import { auditTime, filter, forkJoin, from, fromEvent, merge, pairwise } from 'rxjs';
import { langData } from './lang';
import { ElementActionsWrapperService } from '@ui/wrappers/actions-wrapper/services/element-actions-wrapper.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { animateCancel } from './animations';
import { HeaderButtonComponent } from '@ui/buttons/header-button';
import { TextComponent } from '@ui/text';

@Component( {
    selector: 'bsm-actions-wrapper',
    imports: [ArrowDownIconComponent, TranslatePipe, NgTemplateOutlet, TextComponent, HeaderButtonComponent],
    templateUrl: './actions-wrapper.component.html',
    styleUrl: './actions-wrapper.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger( 'showPopup', [
            state( 'void', style( { transform: 'translateY(100%)' } ) ),
            state( '*', style( { transform: 'translateY(0%)' } ) ),
            transition( 'void <=> *', animate( '0.3s' ) ),
        ] )
    ]
} )
export class ActionsWrapperComponent implements OnInit {
    @Input() public actionVariants: Array<number | undefined> = [0, 0];
    @Input() public centerText: string = '';
    @Input() public set options( options: TActionsWrapper ) {
        this.actionsWrapperClass = new ActionsWrapperClass( options );
    }
    @Input() @HostBinding( 'class.confirm-disabled' ) public isConfirmDisabled: boolean = false;
    @Output() public cancel: EventEmitter<void> = new EventEmitter;
    @Output() public confirm: EventEmitter<void> = new EventEmitter;
    @Output() public startCancel: EventEmitter<void> = new EventEmitter;
    private anchor: Signal<ElementRef<HTMLDivElement> | undefined> = viewChild( 'anchor' );
    public showPopupState: 'void' | '*' = 'void';
    private baseDuration: number = 300;

    protected actionsWrapperClass: ActionsWrapperClass = new ActionsWrapperClass( this.options );
    private elementActionsWrapper: ElementActionsWrapperService = inject( ElementActionsWrapperService );
    @ContentChild( 'columnType1', { static: true } ) columnType1!: TemplateRef<any>;

    constructor( private destroyRef: DestroyRef, private elementRef: ElementRef<HTMLElement>, private ren: Renderer2 ) {
        LanguageService.setLangData( langData[LanguageService.getLangStatic()] );
        elementRef.nativeElement.parentElement?.animate( [
            { opacity: 0 },
            { opacity: 1 }
        ], { fill: 'none', duration: 100 } );

        if ( this.elementRef.nativeElement.parentElement ) { // on overlay click
            fromEvent( this.elementRef.nativeElement.parentElement, 'click' ).pipe( takeUntilDestroyed() ).subscribe( ( ev: Event ) => {
                if ( ev.currentTarget === ev.target ) {
                    this.startCancel.emit();
                    animateCancel( this.elementRef.nativeElement, this.baseDuration ).subscribe( () => {
                        this.cancel.emit();
                    } );
                }
            } );
        }
    }
    columnScroll( event: Event ) {
        if ( event.target instanceof HTMLElement ) {
            this.elementActionsWrapper.scrollTop.set( event.target.scrollTop );
        }

    }
    ngOnInit(): void {
        this.showPopupState = '*';
        const anchor: HTMLDivElement | undefined = this.anchor()?.nativeElement;
        if ( !anchor ) {
            return;
        }
        this.elementActionsWrapper.actionsWrapperRef.set( this.elementRef );

        const baseDuration: number = 300;
        const startRect: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();
        let changedPosition: number = startRect.y;

        merge( fromEvent( anchor, 'touchmove', { passive: true } ), fromEvent( anchor, 'touchend', { passive: true } ) ).pipe(
            takeUntilDestroyed( this.destroyRef ),
            auditTime( 5 ),
            filter( ( event: Event ): event is TouchEvent => event instanceof TouchEvent ),
            pairwise(),
        ).subscribe( ( ev: [TouchEvent, TouchEvent] ) => {
            if ( ev[0].type === 'touchmove' && ev[1].type === 'touchmove' ) {
                const _changedPosition: number = changedPosition + ( ev[1].targetTouches[0].clientY - ev[0].targetTouches[0].clientY );
                if ( _changedPosition >= startRect.y ) {
                    changedPosition = _changedPosition;
                    this.ren.setStyle( this.elementRef.nativeElement, 'transform', `translateY(${changedPosition - startRect.y}px)` );
                }
            } else if ( ev[0].type !== 'touchend' ) {
                const currentTranslateY: number = changedPosition - startRect.y;

                if ( changedPosition - startRect.y < 150 ) {
                    const duration: number = Math.abs( currentTranslateY ) / 0.6;
                    this.elementRef.nativeElement.animate(
                        [
                            { transform: 'translateY(0)' }
                        ],
                        { duration: duration, fill: 'none' }
                    ).finished.finally( () => {
                        changedPosition = startRect.y;
                        this.ren.setStyle( this.elementRef.nativeElement, 'transform', 'translateY(0)' );
                    } );
                } else {
                    const totalDistance: number = document.body.clientHeight - startRect.y;
                    const remainingDistance: number = totalDistance - currentTranslateY;
                    const duration: number = Math.max( ( remainingDistance / totalDistance ) * baseDuration, 100 );

                    const contAnim: Promise<Animation> = this.elementRef.nativeElement.animate( [
                        { transform: 'translateY(100%)' }
                    ], { duration: duration, fill: 'forwards' } ).finished;
                    const parentAnim: Promise<Animation> = ( this.elementRef.nativeElement.parentElement || this.elementRef.nativeElement ).animate( [
                        { opacity: 0 }
                    ], { duration: duration, fill: 'forwards' } ).finished;
                    this.startCancel.emit();
                    forkJoin( [from( contAnim ), from( parentAnim )] ).subscribe( () => {
                        this.cancel.emit();
                    } );
                }
            }
        } );
    }

    onCancel(): void {
        if ( this.actionVariants[0] == 2 ) {
            this.cancel.emit();
        } else {
            this.startCancel.emit();
            animateCancel( this.elementRef.nativeElement, this.baseDuration ).subscribe( () => {
                this.cancel.emit();
            } );
        }
    }
}
