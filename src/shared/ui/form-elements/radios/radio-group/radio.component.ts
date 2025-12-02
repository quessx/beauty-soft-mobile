import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from '@lib/types/SelectOption.class';

@Component({
    selector: 'ui-radio-group',
    templateUrl: './radio.component.html',
    styleUrls: ['./radio.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RadioGroupComponent),
            multi: true,
        },
    ],
})
export class RadioGroupComponent implements ControlValueAccessor {
    @Input() public options: SelectOption[] = [];
    protected currentValue: string = '';

    public onChange: (value: string) => void = () => { };

    public onTouched: () => void = () => { };

    public writeValue(value: string): void {
        this.currentValue = value;
    }

    public registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(): void {

    }

    public handleChange(event: Event): void {
        if (!(event.target instanceof HTMLInputElement)) {
            return;
        }

        this.currentValue = event.target.value;
        this.onChange(this.currentValue);
        this.onTouched();
    }
}
