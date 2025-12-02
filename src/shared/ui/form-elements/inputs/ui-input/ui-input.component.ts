import { ChangeDetectionStrategy, Component, forwardRef, input, InputSignal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonInputPasswordToggle } from '@ionic/angular/standalone';

@Component({
    selector: 'ui-input',
    templateUrl: './ui-input.component.html',
    styleUrls: ['./ui-input.component.scss'],
    imports: [IonInput, ReactiveFormsModule, IonInputPasswordToggle],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef( () => UiInputComponent ),
            multi: true,
        },
    ],
})
export class UiInputComponent implements ControlValueAccessor {
    public placeholder: InputSignal<string | null> = input<string | null>(null);
    public type: InputSignal<string | null> = input<string | null>('text');
    public autocomplete: InputSignal<string | null> = input<string | null>('off');
    
    protected control: FormControl<string | null> = new FormControl('');

    private onChange: Function = (value: string) => {
    };

    constructor() {
        this.control.valueChanges.pipe(takeUntilDestroyed()).subscribe((next: string | null) => {
            this.onChange(next);
        });
    }

    ngOnInit() {}

    writeValue(value: string): void {
        if (typeof value === 'number') {
            value = value + '';
        }
        this.control.setValue(value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        // Register the touched function
    }

    setDisabledState?(isDisabled: boolean): void {
        // Set the disabled state of the input
    }

}
