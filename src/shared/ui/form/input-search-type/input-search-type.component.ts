import { ChangeDetectionStrategy, Component, effect, ElementRef, EventEmitter, forwardRef, inject, Injector, Input, Output, Signal, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ButtonListPopupModel } from '@ui/popups/button-list-popup/button-list-popup.model';
import { filter, Observable, pairwise, Subscription, tap } from 'rxjs';
import { InputComponent } from '@ui/form-elements';
import { SearchInputButtonListPopupService } from '@ui/popups/search-input-button-list-popup/services/search-input-button-list-popup.service';
import { SelectOption } from '@lib/types/SelectOption.class';
import { VectorEditIconComponent } from '@icons/vector-edit-icon';

@Component({
    selector: 'beauty-input-search-type',
    imports: [InputComponent, ReactiveFormsModule, NgxMaskDirective, VectorEditIconComponent],
    templateUrl: './input-search-type.component.html',
    styleUrl: './input-search-type.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputSearchTypeComponent),
            multi: true
        }
    ],
})
export class InputSearchTypeComponent implements ControlValueAccessor {
    @Input() placeholder: string = '';
    @Input() usedMask: string = '';
    @Input() options: ButtonListPopupModel | undefined = undefined;
    @Input() signalOptions: Signal<ButtonListPopupModel> | undefined = undefined;
    @Input() searchSignal: WritableSignal<string> | undefined = undefined;
    @Input() set isDisabled(value: boolean) {
        if (value) {
            this.control.disable({ emitEvent: false });
        } else {
            this.control.enable({ emitEvent: false });
        }
    }

    @Output() closePopup: EventEmitter<undefined> = new EventEmitter();

    public control = new FormControl('');

    private onChange: (value: string) => void = () => {
    };
    private searchInputButtonListPopupService: SearchInputButtonListPopupService = inject(SearchInputButtonListPopupService);
    private elementRef: ElementRef = inject(ElementRef);
    private selectedId: WritableSignal<string> = signal('');
    private isOpenSignal: WritableSignal<boolean> = signal(false);
    private searchSubscription: Subscription | undefined;
    private injector = inject(Injector);

    constructor() {
        toObservable(this.selectedId).pipe(
            takeUntilDestroyed(),
            pairwise(),
            filter(([prev, next]: [string, string]) => prev !== next),
        ).subscribe(([prev, next]: [string, string]) => {
            this.searchSubscription?.unsubscribe();
            this.setControlValue(next);
            this.onChange(next);
        });

        this.control.valueChanges.pipe(takeUntilDestroyed()).subscribe((value: string | null) => {
            this.onChange(value + '');
        });
    }

    writeValue(selectedId: string): void {
        if (typeof selectedId !== 'string') {
            selectedId = '';
        }
        this.selectedId.set(selectedId);
        this.setControlValue(selectedId);
    }

    setControlValue(selectedId: string): void {
        let options: ButtonListPopupModel | undefined = this.signalOptions ? this.signalOptions() : this.options;
        if (options) {
            let selectedOption: SelectOption | undefined = Array.from(options).find((option: SelectOption) => option.id === selectedId);
            this.control.setValue(selectedOption?.value || '', {emitEvent: false});
        } else {
            this.control.setValue(selectedId || '', {emitEvent: false});
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {}
    setDisabledState?(isDisabled: boolean): void {}
    onFocus(): void {
        if (!this.options && !this.signalOptions) {
            return;
        }
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
        if (this.searchSignal) {
            this.searchSubscription = toObservable(this.searchSignal, {
                injector: this.injector
            }).pipe(
                pairwise(),
                filter(([prev, next]: [string, string]) => prev !== next),
            ).subscribe(([prev, next]: [string, string]) => {
                if (next !== null) {
                    this.control.setValue(next);
                } else {
                    this.setControlValue(this.selectedId());
                }
            });
        }
        let options: ButtonListPopupModel | Signal<ButtonListPopupModel> | undefined = !!this.signalOptions ? this.signalOptions : this.options;
        this.searchInputButtonListPopupService.hide().setIsOpenSignal(this.isOpenSignal)
            .show(this.elementRef, options, this.selectedId, this.usedMask, this.searchSignal);
    }
    clear(): void {
        this.control.setValue('');
        this.selectedId.set('');
        this.searchSignal?.set('');
        this.closePopup.emit();
    }
}
