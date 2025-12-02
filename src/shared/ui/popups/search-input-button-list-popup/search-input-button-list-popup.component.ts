import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, EventEmitter, HostListener, inject, input, Input, InputSignal, Output, Renderer2, Signal, ViewChild, WritableSignal } from '@angular/core';
import { ButtonListPopupModel } from '../button-list-popup/button-list-popup.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { CloseIconComponent } from '@icons/close-icon/close-icon.component';
import { CheckMarkIconComponent } from '@icons/check-mark-icon/check-mark-icon.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { InputComponent } from '@ui/form-elements';
import { SelectOption } from '@lib/types/SelectOption.class';

@Component({
  selector: 'beauty-search-input-button-list-popup',
  imports: [NgClass, ReactiveFormsModule, InputComponent, ReactiveFormsModule, NgxMaskDirective, CloseIconComponent, CheckMarkIconComponent],
  templateUrl: './search-input-button-list-popup.component.html',
  styleUrls: ['../input-button-list-popup/input-button-list-popup.component.css', './search-input-button-list-popup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchInputButtonListPopupComponent {
    @Input() model: ButtonListPopupModel | Signal<ButtonListPopupModel> = new ButtonListPopupModel();
    @Input() parentElRef: ElementRef | undefined = undefined;
    @Input() selectedId: WritableSignal<string | undefined> | undefined = undefined;
    @Input() searchSignal: WritableSignal<string | null> | undefined = undefined;
    @Input() usedMask: string = '';
    public placeholder: InputSignal<string> = input('');

    @ViewChild('cont') set cont(container: ElementRef<HTMLDivElement> | undefined) {
        if (!!container) {
            this.optionContainer = container;
            this.setCoords();
            if (!!this.searchSignal && this.searchSignal() && this.control.value === null) {
                this.control.setValue(this.searchSignal(), {emitEvent: false});
                this.optionContainer.nativeElement.getElementsByTagName('input')[0].focus();
            } else if(this.selectedId && this.control.value === null) {
                let selectedId: string = this.selectedId() || '';
                let selectedOption: SelectOption | undefined = Array.from(this._model()).find((option: SelectOption) => option.id === selectedId);
                this.control.setValue(selectedOption?.value || '', {emitEvent: false});
                this.optionContainer.nativeElement.getElementsByTagName('input')[0].focus();
            }
        }
    };

    @Output() closeModal: EventEmitter<undefined> = new EventEmitter();

    public control: FormControl<string | null> = new FormControl(null);
    public _model: Signal<ButtonListPopupModel> = computed(() => {
        return this.model instanceof ButtonListPopupModel ? this.model : this.model();
    });

    protected renderer: Renderer2 = inject(Renderer2);

    private optionContainer: ElementRef<HTMLDivElement> | undefined;


    constructor() {
        this.control.valueChanges.pipe(
            takeUntilDestroyed(),
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe((value: string | null) => {
            if (this.searchSignal) {
                this.searchSignal.set(value || '');
            }
        });
    }

    setCoords(): void {
        if (!this.parentElRef || !this.optionContainer) {
            return;
        }

        let coords: DOMRect = this.parentElRef.nativeElement.getBoundingClientRect();
        this.renderer.setStyle(this.optionContainer.nativeElement, 'left', coords.x + 'px');
        this.renderer.setStyle(this.optionContainer.nativeElement, 'top', coords.y + 'px');
        this.renderer.setStyle(this.optionContainer.nativeElement, 'width', coords.width + 'px');
        let input: Element | undefined = this.optionContainer.nativeElement.querySelectorAll('input.w-100')[0];
        if (input && input instanceof HTMLInputElement) {
            input.focus();
        }
    }
    onMousedown(event: MouseEvent, option: SelectOption<string, any>): void {
        event.stopPropagation();
        if (event.button) {
            return;
        }
        if (this.selectedId) {
            this.selectedId.set(option.id);
            this.searchSignal?.set(null);
        }
        this.emitCloseModalEvent();
    }

    emitCloseModalEvent(): this {
        this.closeModal.emit();
        return this;
    }

    @HostListener('click') onClick() {
        this.emitCloseModalEvent();
    }

    clear(): void {
        this.control.setValue('');
        this.selectedId?.set('');
        this.searchSignal?.set('');
    }
}
