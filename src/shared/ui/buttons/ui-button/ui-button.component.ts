import { Component, computed, HostListener, input, Input, InputSignal, output, OutputEmitterRef, Signal, signal, WritableSignal } from '@angular/core';
import { SpinnerIconComponent, TranslatePipe } from "beauty-soft-common";
import { finalize, isObservable } from 'rxjs';
import { THandlerReturn, TStatus, TType } from "./types/ui-button.types";

@Component( {
    selector: 'ui-button',
    templateUrl: './ui-button.component.html',
    styleUrls: ['./ui-button.component.scss'],
    imports: [TranslatePipe, SpinnerIconComponent],
    host: {
        '[class]': 'hostClass()'
    }
} )
export class UiButtonComponent {
    public success: OutputEmitterRef<void> = output<void>();
    public error: OutputEmitterRef<unknown> = output<unknown>();
    protected loading: WritableSignal<boolean> = signal( false );
    public status: InputSignal<TStatus> = input<TStatus>( 'def' );
    public type: InputSignal<TType> = input<TType>( 'primary' );
    public showSpinner: InputSignal<boolean> = input<boolean>( true );
    public text: InputSignal<string> = input<string>( '' );

    protected hostClass: Signal<( TStatus | TType )[]> = computed( () => {
        const status: TStatus = this.loading() && this.showSpinner() ? 'icon-only' : this.status();
        return [this.type(), status];
    } );

    @Input() handler?: () => THandlerReturn;

    constructor() { }

    @HostListener( 'click' ) onClick() {
        if ( !this.handler || this.loading() ) {
            return;
        }

        const ret: THandlerReturn = this.handler();
        // Ничего не вернули — просто выходим
        if ( !ret ) {
            return;
        }

        this.loading.set( true );

        if ( isObservable( ret ) ) {
            ret.pipe( finalize( () => ( this.loading.set( false ) ) ) )
                .subscribe( {
                    next: () => { },
                    complete: () => this.success.emit(),
                    error: ( e ) => { this.error.emit( e ); }
                } );
        } else {
            Promise.resolve( ret )
                .then( () => this.success.emit() )
                .catch( ( e ) => this.error.emit( e ) )
                .finally( () => ( this.loading.set( false ) ) );
        }
    }
}
