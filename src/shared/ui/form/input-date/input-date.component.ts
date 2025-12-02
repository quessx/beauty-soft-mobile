import { ChangeDetectionStrategy, Component, forwardRef, input, InputSignal, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, pairwise } from 'rxjs';

@Component({
    selector: 'bsm-input-date',
    imports: [ReactiveFormsModule],
    templateUrl: './input-date.component.html',
    styleUrl: './input-date.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputDateComponent),
            multi: true
        }
    ]
})
export class InputDateComponent implements ControlValueAccessor {
    startTime: InputSignal<number> = input(0);
    endTime: InputSignal<number> = input(23);
    public date: WritableSignal<string> = signal('');
    public control: FormControl<string | null> = new FormControl('');
    private onChange: (value: string) => void = (value: string) => {
    };
    private onTouched: () => void = () => {
    };

    constructor() {
        toObservable(this.date).pipe(
            takeUntilDestroyed(),
            pairwise(),
            filter(([prev, next]: [string, string]) => prev !== next),
        ).subscribe(([prev, next]: [string, string]) => {
            this.control.setValue(next);
            this.onChange(next);
        });
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    writeValue(date: string | null): void {
        if (typeof date !== 'string') {
            date = '';
        }

        // Преобразование формата даты из DD/MM/YYYY в YYYY-MM-DD
        if (date && this.isValidDateFormat(date)) {
            date = this.convertDateFormat(date);
        }

        this.date.set(date || '');
        this.control.setValue(date);
    }

    onInput($event: Event): void {
        const input: EventTarget | null = $event.target;
        if (!(input instanceof HTMLInputElement)) {
            return;
        }
        this.date.set(input.value);
    }

    private isValidDateFormat(date: string): boolean {
        // Проверяем формат DD/MM/YYYY
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        return dateRegex.test(date);
    }

    private convertDateFormat(date: string): string {
        // Преобразуем DD/MM/YYYY в YYYY-MM-DD
        const parts = date.split('/');
        if (parts.length === 3) {
            const day = parts[0];
            const month = parts[1];
            const year = parts[2];
            return `${year}-${month}-${day}`;
        }
        return date;
    }
}
