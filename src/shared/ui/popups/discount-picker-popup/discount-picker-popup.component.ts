import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, inject, input, Input, InputSignal, output, OutputEmitterRef, Renderer2, Signal, signal, viewChild, viewChildren, WritableSignal } from '@angular/core';

@Component( {
    selector: 'bsm-discount-picker-popup',
    templateUrl: './discount-picker-popup.component.html',
    styleUrls: ['./discount-picker-popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class DiscountPickerPopupComponent implements AfterViewInit {
    @Input() public value: WritableSignal<string> = signal( '' );
    public itemEl: Signal<readonly ElementRef[]> = viewChildren( 'itemEl' );
    public parentEl: InputSignal<HTMLElement> = input.required<HTMLElement>();
    public min: InputSignal<number> = input( 0 );
    public max: InputSignal<number> = input( 99 );
    private renderer: Renderer2 = inject( Renderer2 );
    private elementRef: ElementRef = inject( ElementRef );
    private scrollContainer: Signal<ElementRef<HTMLElement> | undefined> = viewChild<ElementRef>( 'scrollContainer' );
    public closeModal: OutputEmitterRef<void> = output();
    public onChange: OutputEmitterRef<string> = output();

    public currentValue: WritableSignal<number> = signal( 0 );

    public items: Signal<number[]> = computed( () => {
        const result: number[] = [];
        for ( let i: number = this.min(); i <= this.max(); i++ ) {
            result.push( i );
        }
        return result;
    } );

    ngAfterViewInit(): void {
        const cont: ElementRef<HTMLElement> | undefined = this.scrollContainer();
        if ( !cont ) {
            return;
        }
        const rect: DOMRect = this.parentEl().getBoundingClientRect();
        this.renderer.setStyle( cont.nativeElement, 'left', rect.left + 'px' );
        this.renderer.setStyle( cont.nativeElement, 'top', rect.top - cont.nativeElement.clientHeight / 2 + rect.height / 2 + 4 + 'px' );

        this.setupScrollListener();
        this.scrollToCurrentValue();
        this.updateValueFromScroll();
    }


    public isActive( item: number ): boolean {
        return this.currentValue() === item;
    }

    private setupScrollListener(): void {
        const container: HTMLElement | undefined = this.scrollContainer()?.nativeElement;
        if ( !container ) {
            return;
        }

        container.addEventListener( 'scroll', ( event: Event ): void => {
            this.updateValueFromScroll();
        } );
    }

    private updateValueFromScroll(): void {
        const container: HTMLElement | undefined = this.scrollContainer()?.nativeElement;
        if ( !container ) {
            return;
        }

        // Find the child whose center is closest to the container's visible center.
        const children: HTMLElement[] = Array.from( container.querySelectorAll( 'span[item]' ) );
        if ( !children.length ) {
            return;
        }

        const visibleCenter: number = container.scrollTop + container.clientHeight / 2;

        let bestIndex: number = 0;
        let bestDistance: number = Number.POSITIVE_INFINITY;

        for ( let i: number = 0; i < children.length; i++ ) {
            const child: HTMLElement = children[i];
            // offsetTop is relative to the scroll container's content
            const childCenter: number = child.offsetTop + child.offsetHeight / 2;
            const dist: number = Math.abs( childCenter - visibleCenter );
            if ( dist < bestDistance ) {
                bestDistance = dist;
                bestIndex = i;
            }
        }

        const clampedIndex: number = Math.max( 0, Math.min( bestIndex, this.items().length - 1 ) );
        const newValue: number = this.items()[clampedIndex];
        this.currentValue.set( newValue );
        this.value.set( `${newValue}` );

        // emit the actual string value from the signal
        this.emitChangeModalEvent( this.value() );

        // Apply fading/scale to children based on distance from active
        this.applyFadeToChildren( children, clampedIndex );
    }

    private scrollToCurrentValue(): void {
        const container: HTMLElement | undefined = this.scrollContainer()?.nativeElement;
        if ( !container ) {
            return;
        }

        const raw: string = String( this.value() );
        const parsed: number = raw ? parseInt( raw.replace( /\D/g, '' ), 10 ) : NaN;
        const currentVal: number = Number.isNaN( parsed ) ? this.min() : parsed;
        const index: number = this.items().indexOf( currentVal );
        if ( index !== -1 ) {
            const children: readonly ElementRef[] = this.itemEl();
            if ( children.length > index ) {
                const child: ElementRef = children[index];
                const childCenter: number = child.nativeElement.offsetTop + child.nativeElement.offsetHeight / 2;
                const targetScrollTop: number = childCenter - container.clientHeight / 2;

                // Temporarily ensure instant (non-smooth) scroll so it doesn't animate on open.
                const prevScrollBehavior: string = container.style.scrollBehavior;
                try {
                    container.style.scrollBehavior = 'auto';
                } catch ( e ) {
                    console.error(e);
                }

                // Set immediately without animation
                container.scrollTop = Math.max( 0, Math.round( targetScrollTop ) );

                // Restore previous scroll behavior after positioning
                try {
                    container.style.scrollBehavior = prevScrollBehavior || '';
                } catch ( e ) {
                    console.error(e);
                }

                // Update signals and emit the change immediately so the value is set on open
                this.currentValue.set( currentVal );
                this.value.set( `${currentVal}` );
                this.emitChangeModalEvent( this.value() );

                // Apply fade after positioning
                const els: HTMLElement[] = children.map( ( c: ElementRef ): HTMLElement => c.nativeElement );
                this.applyFadeToChildren( els, index );
            }
        }
    }

    private applyFadeToChildren( children: HTMLElement[], activeIndex: number ): void {
        if ( !children || !children.length ) {
            return;
        }
        for ( let i: number = 0; i < children.length; i++ ) {
            const child: HTMLElement = children[i];
            const dist: number = Math.abs( i - activeIndex );
            let opacity: number = 1;
            let scale: number = 1;

            if ( dist === 0 ) {
                opacity = 1;
                scale = 1.06;
            } else if ( dist === 1 ) {
                opacity = 0.85;
                scale = 1.0;
            } else if ( dist === 2 ) {
                opacity = 0.55;
                scale = 0.98;
            } else {
                opacity = 0.25;
                scale = 0.95;
            }

            try {
                this.renderer.setStyle( child, 'opacity', String( opacity ) );
                this.renderer.setStyle( child, 'transform', `scale(${scale})` );
                this.renderer.setStyle( child, 'transition', 'opacity 160ms ease, transform 160ms ease' );
            } catch ( e ) {
                // ignore DOM write errors in SSR/test
            }
        }
    }

    public onItemClick( item: number ): void {
        this.currentValue.set( item );
        this.value.set( String( item ) );

        this.emitChangeModalEvent( this.value() );
        this.emitCloseModalEvent();
    }

    public emitChangeModalEvent( value: string ): void {
        this.onChange.emit( value );
    }

    public emitCloseModalEvent(): void {
        this.closeModal.emit();
    }

    @HostListener( 'click', ['$event'] )
    public onHostClick( event: Event ): void {
        if ( event.currentTarget == event.target ) {
            this.emitCloseModalEvent();
        }
    }
}
