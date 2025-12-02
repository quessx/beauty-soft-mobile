import { ChangeDetectionStrategy, Component, effect, ElementRef, forwardRef, inject, Renderer2, signal, WritableSignal, Input, viewChild, Signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { CalendateIconComponent } from '@icons/calendate-icon/calendate-icon.component';
import { DatepickerPopupService } from '@ui/popups/datepicker-popup/datepicker-popup.service';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { pairwise, filter } from 'rxjs';
import moment from "moment";
import 'moment/locale/ru';
import { LeftColumnForLineComponent } from '@ui/templates/left-column-for-line';


@Component({
    selector: 'beauty-input-date',
    imports: [ReactiveFormsModule, LeftColumnForLineComponent],
    templateUrl: './input-date.component.html',
    styleUrl: './input-date.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BeautyInputDateComponent),
            multi: true
        }
    ],
})
export class BeautyInputDateComponent implements ControlValueAccessor {
    inputElement: Signal<ElementRef | undefined> = viewChild('inputElement');
    private datepickerPopupService: DatepickerPopupService = inject(DatepickerPopupService);
    private elementRef: ElementRef = inject(ElementRef);
    private renderer: Renderer2 = inject(Renderer2);

    public date: WritableSignal<string> = signal('');
    public control: FormControl<string | null> = new FormControl('');
    private onChange: Function = (value: string) => {
    };
    private onTouched: () => void = () => {
    };

    constructor() {
        toObservable(this.date).pipe(
            takeUntilDestroyed(),
            pairwise(),
            filter(([prev, next]: [string, string]) => prev !== next),
        ).subscribe(([prev, next]: [string, string]) => {
            this.control.setValue(this.formatForValue(next));
            this.onChange(next);
        });

        moment.locale('ru');
    }

    private formatForValue(date: string): string {
        if (date && this.isValidDateFormat(date)) {
            date = this.convertDateFormat(date);
        }
        return moment(date, 'YYYY-MM-DD').format('D MMMM');
    }

    writeValue(date: string): void {
        if (typeof date !== 'string') {
            date = '';
        }

        // Преобразование формата даты из DD/MM/YYYY в YYYY-MM-DD
        if (date && this.isValidDateFormat(date)) {
            date = this.convertDateFormat(date);
        }
        this.date.set(date);
        this.control.setValue(this.formatForValue(date));
    }
    private isValidDateFormat(date: string): boolean {
        // Проверяем формат DD/MM/YYYY
        const dateRegex: RegExp = /^\d{2}\/\d{2}\/\d{4}$/;
        return dateRegex.test(date);
    }

    private convertDateFormat(date: string): string {
        // Преобразуем DD/MM/YYYY в YYYY-MM-DD
        const parts: string[] = date.split('/');
        if (parts.length === 3) {
            const day: string = parts[0];
            const month: string = parts[1];
            const year: string = parts[2];
            return `${year}-${month}-${day}`;
        }
        return date;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.renderer.addClass(this.elementRef.nativeElement, 'disabled');
        } else {
            this.renderer.removeClass(this.elementRef.nativeElement, 'disabled');
        }
    }

    onOpenPopup(): void {
        this.datepickerPopupService.show(this.elementRef, this.date).setOnChangeEvent(() => {
            const inputElement: HTMLInputElement | undefined = this.inputElement()?.nativeElement;
            if (inputElement) {
                inputElement.blur();
            }
        });
    }

    onInput(event: Event): void {
        const input: EventTarget | null = event.target;
        if (!(event instanceof InputEvent) || !(input instanceof HTMLInputElement)) {
            return;
        }
        this.date.set(input.value);
    }
}
