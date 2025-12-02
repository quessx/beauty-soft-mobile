import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, HostBinding, HostListener, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxedIconComponent } from '@icons/checkboxed-icon';
import { UncheckboxedIconComponent } from '@icons/uncheckboxed-icon';

@Component( {
    selector: 'ui-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef( () => CheckboxComponent ),
            multi: true,
        },
    ],
    imports: [CheckboxedIconComponent, UncheckboxedIconComponent]
} )
export class CheckboxComponent implements ControlValueAccessor {
    @Input() public label: string = '';
    @Input() public disabled: boolean = false;
    @Input() @HostBinding( 'class.checked' ) public checked: boolean = false;
    @Output() public checkedChange = new EventEmitter<boolean>();

    public onChange: ( value: boolean ) => void = () => { };
    public onTouched: () => void = () => { };

    public writeValue( value: boolean ): void {
        this.checked = value;
    }

    public registerOnChange( fn: ( value: boolean ) => void ): void {
        this.onChange = fn;
    }

    public registerOnTouched( fn: () => void ): void {
        this.onTouched = fn;
    }

    public setDisabledState( isDisabled: boolean ): void {
        this.disabled = isDisabled;
    }

    public handleChange( event: boolean ): void {
        this.checked = event;
        this.onChange( this.checked );
        this.checkedChange.emit( this.checked );
    }

    @HostListener( 'click' ) onHostClick(): void {
        this.handleChange( !this.checked );
    }
}
