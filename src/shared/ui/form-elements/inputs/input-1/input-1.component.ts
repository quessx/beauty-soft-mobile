import { Attribute, ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, input, InputSignal, output, OutputEmitterRef, Renderer2, Signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from 'beauty-soft-common';
import { TInputType, TTailIcon } from './type';

@Component( {
    selector: 'bsm-input-1',
    imports: [TranslatePipe],
    templateUrl: './input-1.component.html',
    styleUrl: './input-1.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef( () => Input1Component ),
            multi: true,
        },
    ]
} )
export class Input1Component implements ControlValueAccessor {
    private inputEl: Signal<ElementRef<HTMLInputElement> | undefined> = viewChild( 'input', { read: ElementRef } );
    private value: string = '';
    public tailClick: OutputEmitterRef<void> = output();
    public label: InputSignal<string> = input( '' );
    public labelOptional: InputSignal<string> = input( '' );
    public labelRequired: InputSignal<boolean> = input( false );
    public helperText: InputSignal<string> = input( '' );
    public flag: InputSignal<string> = input( '' );
    public dropdown: InputSignal<boolean> = input( false );
    public lead: InputSignal<string> = input( '' );
    public placeholder: InputSignal<string> = input( '' );
    public badge: InputSignal<string> = input( '' );
    @Input() public tail: TTailIcon = null;
    public tailDropdown: InputSignal<boolean> = input( false );
    get _type() {
        return this.tail === 'eye-cross' && this.type === 'password' ? 'text' : this.type;
    }

    constructor(
        private ren: Renderer2,
        @Attribute( 'type' ) protected type: TInputType | null,
        @Attribute( 'enterkeyhint' ) protected enterKeyHint: string | null,
        @Attribute( 'autocomplete' ) protected autocomplete: 'current-password' | 'new-password' | null
    ) { }

    private onChange: Function = ( value: string ) => {
    };

    registerOnChange( fn: any ): void {
        this.onChange = fn;
    }

    registerOnTouched( fn: any ): void {

    }

    setDisabledState( isDisabled: boolean ): void {

    }

    writeValue( obj: any ): void {
    }

    onInput( ev: Event ): void {
        if ( !( ev.target instanceof HTMLInputElement ) ) {
            return;
        }
        const value: string = ev.target.value;
        this.onChange( value );
    }

    onTailClick(): void {
        if ( this.tail === 'eye' ) {
            this.tail = 'eye-cross';
        } else if ( this.tail === 'eye-cross' ) {
            this.tail = 'eye';
        }
        this.tailClick.emit();
    }

    focus( options?: FocusOptions ): void {
        this.inputEl()?.nativeElement.focus( options );
    }
}
