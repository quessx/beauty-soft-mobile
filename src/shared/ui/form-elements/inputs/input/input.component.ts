import { Attribute, ChangeDetectionStrategy, Component, computed, ElementRef, EventEmitter, forwardRef, inject, Input, OnInit, Output, Renderer2, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LoupeIconComponent } from '@icons/loupe-icon/loupe-icon.component';
import { PercentIconComponent } from '@icons/percent-icon';
import { RubleIconComponent } from '@icons/ruble-icon';
import { InputTypeClass, TInputTypeIcons } from '@ui/form-elements';
import { DiscountPickerPopupService } from '@ui/popups/discount-picker-popup/services/discount-picker-popup.service';
import { amountFormatted } from '@ui/formatters/amount/amount-formatted.function';
import { debounceTime, filter, pairwise, timer } from 'rxjs';

@Component( {
    selector: 'ui-input-from',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    imports: [LoupeIconComponent, RubleIconComponent, PercentIconComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef( () => InputComponent ),
            multi: true,
        },
    ],
} )
export class InputComponent implements ControlValueAccessor, OnInit {
    @Input() public inputMode: string = 'text';
    @Input() public placeholder: string = '';
    @Input() public disabled: boolean = false;

    @Input() public set options( options: TInputTypeIcons ) {
        if ( options ) {
            this.inputTypeClass = new InputTypeClass( options );
        }
    }
    private discountPickerPopupService: DiscountPickerPopupService = inject( DiscountPickerPopupService );
    protected inputTypeClass: InputTypeClass = new InputTypeClass( this.options );
    protected valueSignal: WritableSignal<string> = signal( '' );
    protected inputElement: Signal<ElementRef | undefined> = viewChild('inputElement');
    @Output() public valueChange: EventEmitter<string> = new EventEmitter<string>();

    private renderer: Renderer2 = inject( Renderer2 );
    private elementRef: ElementRef = inject( ElementRef );

    protected value: Signal<string> = computed( () => {
        let value: string = this.valueSignal();
        if ( value && this.isPercent() ) {
            value = `-${value}%`;
        } else if ( value && this.inputTypeClass.isNeedRubIcon ) {
            // Форматируем сумму с разделителями тысяч (с сохранением копеек)
            const numericValue = parseFloat(value.replace(/\s/g, ''));
            if (!isNaN(numericValue)) {
                value = amountFormatted(numericValue, false, false);
            }
        }
        return value;
    } );

    protected inputSize: Signal<number> = computed( () => {
        // используем отображаемое значение
        const displayed: string = this.value() || '';
        // отбрасываем дробную часть: всё после запятой или точки
        let integerPart: string = displayed;
        const commaIndex: number = displayed.indexOf(',');
        const dotIndex: number = displayed.indexOf('.');
        if (commaIndex !== -1) {
            integerPart = displayed.substring(0, commaIndex);
        } else if (dotIndex !== -1) {
            integerPart = displayed.substring(0, dotIndex);
        }
        // удаляем разделители тысяч и пробелы
        const sanitized: string = integerPart.replace(/[.\s]/g, '');
        const minSize: number = 1;
        const calculatedSize: number = Math.max(minSize, sanitized.length + 1);
        return calculatedSize || 1;
    } );

    private changeValues: WritableSignal<string> = signal( '' );

    public constructor() {
        toObservable( this.changeValues ).pipe(
            pairwise(),
            debounceTime( 100 ),
            filter( ( [prev, curr]: [string, string] ) => curr !== prev ),
            takeUntilDestroyed()
        ).subscribe( ( [prev, curr]: [string, string] ) => {
            if ( this.inputTypeClass.type === 'percent' ) {
                this.valueSignal.set( curr );
                this.onChange( curr );
                this.valueChange.emit( curr );
            }
        } );
    }

    protected isPercent: Signal<boolean> = computed( () => {
        return this.inputTypeClass.type === 'percent';
    } );

    public onChange: ( value: string ) => void = (): void => {
    };
    public onTouched: () => void = (): void => {
    };

    public writeValue( value: string ): void {
        if ( this.isPercent() && !value ) {
            this.valueSignal.set( '' );
        } else if ( this.inputTypeClass.isNeedRubIcon && value ) {
            // Для сумм сохраняем исходное числовое значение
            const numericValue: string = typeof value === 'string' ? value.replace(/[^\d.,]/g, '').replace(',', '.') : value + '';
            this.valueSignal.set( numericValue );
        } else {
            this.valueSignal.set( value + '' );
        }
    }

    public registerOnChange( fn: ( value: string ) => void ): void {
        this.onChange = fn;
    }

    public registerOnTouched( fn: () => void ): void {
        this.onTouched = fn;
    }

    public setDisabledState( isDisabled: boolean ): void {
        this.disabled = isDisabled;
    }

    public handleInput( event: Event ): void {
        const target: EventTarget | null = event.target;
        if ( !( target instanceof HTMLInputElement ) ) {
            return;
        }

        let inputValue: string = target.value;

        if ( this.inputMode === 'numeric' && inputValue.length > 9 ) {
            inputValue = inputValue.slice( undefined, -1 );
        }
        // Сохраняем текущую позицию курсора
        const cursorPosition: number | null = target.selectionStart;
        const oldValue: string = target.value;
        // Если это поле с рублевой иконкой (сумма), обрабатываем форматирование
        if ( this.inputTypeClass.isNeedRubIcon ) {
            // Удаляем все символы кроме цифр, точки и запятой
            let cleanValue: string = inputValue.replace(/[^\d.,]/g, '').replace(',', '.');

            // Проверяем корректность десятичного разделителя
            const dotIndex: number = cleanValue.indexOf('.');
            if (dotIndex !== -1) {
                // Оставляем только первую точку и максимум 2 знака после неё
                const beforeDot: string = cleanValue.substring(0, dotIndex);
                const afterDot: string = cleanValue.substring(dotIndex + 1).replace(/\./g, '').substring(0, 2);
                cleanValue = beforeDot + '.' + afterDot;
            }

            // Сохраняем исходное числовое значение без форматирования
            this.valueSignal.set( cleanValue );
            this.onChange( cleanValue );
            this.valueChange.emit( cleanValue );
        } else {
            this.valueSignal.set( inputValue );
            this.onChange( this.valueSignal() );
            this.valueChange.emit( this.valueSignal() );
        }

        // Восстанавливаем позицию курсора после обновления DOM
        timer(0).subscribe(() => {
            if (cursorPosition !== null && target) {
                // Вычисляем новую позицию курсора с учетом форматирования
                const newCursorPosition: number = this.calculateCursorPosition(
                    oldValue,
                    target.value,
                    cursorPosition
                );
                target.setSelectionRange(newCursorPosition, newCursorPosition);
            }
        });
    }

    /**
     * Вычисляет новую позицию курсора после форматирования
     */
    private calculateCursorPosition(oldValue: string, newValue: string, oldCursorPos: number): number {
        // Находим позицию запятой в старом и новом значении
        const oldCommaIndex: number = oldValue.indexOf(',');
        const newCommaIndex: number = newValue.indexOf(',');

        // Если курсор был после запятой в старом значении, сохраняем относительную позицию
        if (oldCommaIndex !== -1 && oldCursorPos > oldCommaIndex) {
            if (newCommaIndex !== -1) {
                const offsetFromComma: number = oldCursorPos - oldCommaIndex;
                return Math.min(newCommaIndex + offsetFromComma, newValue.length);
            }
        }

        // Если курсор был до запятой или запятой нет, работаем с целой частью
        const beforeCursor: string = oldValue.substring(0, Math.min(oldCursorPos, oldCommaIndex !== -1 ? oldCommaIndex : oldValue.length));

        // Считаем количество значащих символов (цифр) до курсора, исключая пробелы
        const digitsBeforeCursor: number = (beforeCursor.match(/\d/g) || []).length;

        // Находим позицию в новом значении, где будет то же количество цифр
        let digitCount: number = 0;
        let newCursorPos: number = 0;
        const newIntegerPart: string = newCommaIndex !== -1 ? newValue.substring(0, newCommaIndex) : newValue;

        for (let i = 0; i < newIntegerPart.length; i++) {
            if (newValue[i] >= '0' && newValue[i] <= '9') {
                digitCount++;
                if (digitCount >= digitsBeforeCursor) {
                    newCursorPos = i + 1;
                    break;
                }
            } else if (digitCount > 0) {
                newCursorPos = i;
            }
        }

        // Если не нашли позицию, но есть цифры, ставим курсор в конец целой части
        if (newCursorPos === 0 && digitsBeforeCursor > 0) {
            newCursorPos = newCommaIndex !== -1 ? newCommaIndex : newValue.length;
        }

        return Math.min(newCursorPos, newValue.length);
    }

    public ngOnInit(): void {
        if ( this.isPercent() ) {
            this.onClickInput();
        }
    }

    public onClickInput(): void {
        this.renderer.listen( this.elementRef.nativeElement, 'mousedown', ( $event: Event ): void => {
            $event.stopPropagation();
            $event.preventDefault();
            this.discountPickerPopupService.show( this.elementRef, this.valueSignal ).setOnChangeEvent( ( ( value: string ): void => {
                this.changeValues.set( value );
            } ) );
        } );
    }
}
