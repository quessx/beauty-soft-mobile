# shared/ui/form-elements

Папка для переиспользуемых элементов форм: инпуты, чекбоксы и другие элементы управления формами.

В данной папке должны быть только элементы, реализующие интерфейс ControlValueAccessor.

Пример:
```typescript
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component ( {
    selector: 'app-custom-input',
    template: `<input [value]="value" (input)="onInput ( $event )" />`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef ( ( ) => CustomInputComponent ),
            multi: true
        }
    ]
} )
export class CustomInputComponent implements ControlValueAccessor {
    value: string = '';
    onChange: ( value: string ) => void = ( ) => { };
    onTouched: ( ) => void = ( ) => { };

    writeValue ( value: string ): void {
        this.value = value;
    }
    registerOnChange ( fn: ( value: string ) => void ): void {
        this.onChange = fn;
    }
    registerOnTouched ( fn: ( ) => void ): void {
        this.onTouched = fn;
    }
    setDisabledState? ( isDisabled: boolean ): void {
        // реализовать при необходимости
    }
    onInput ( event: Event ): void {
        const value = ( event.target as HTMLInputElement ).value;
        this.value = value;
        this.onChange ( value );
        this.onTouched ( );
    }
}
```
