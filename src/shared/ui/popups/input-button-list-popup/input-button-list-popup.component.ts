import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, Renderer2, signal, ViewChild, WritableSignal } from '@angular/core';
import { ButtonListPopupModel } from '../button-list-popup/button-list-popup.model';
import { TranslatePipe } from '@i18n/translate.pipe';
import { CheckMarkIconComponent } from '@icons/check-mark-icon/check-mark-icon.component';
import { NgClass } from '@angular/common';
import { ExpendableIconComponent } from '@icons/expendable-icon/expendable-icon.component';
import { ID_NEW_OPTION } from './input-button-list-popup.enums';
import { InputComponent } from '@ui/form-elements';
import { SelectOption } from '@lib/types/SelectOption.class';

@Component({
    selector: 'beauty-input-button-list-popup',
    imports: [TranslatePipe, CheckMarkIconComponent, NgClass, InputComponent, ExpendableIconComponent],
    templateUrl: './input-button-list-popup.component.html',
    styleUrl: './input-button-list-popup.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'custom-scroll' },
})
export class InputButtonListPopupComponent {
    @Input() set model(it: ButtonListPopupModel) {
        this.displayedModels.set(it);
        this._models = it;
    };

    private _models: ButtonListPopupModel = new ButtonListPopupModel;
    public displayedModels: WritableSignal<ButtonListPopupModel> = signal(this.model);
    public _input: string = '';
    @Input() parentElRef: ElementRef | undefined = undefined;
    @Input() selectedId: WritableSignal<SelectOption | undefined> | undefined = undefined;

    @ViewChild('cont') set cont(container: ElementRef<HTMLDivElement> | undefined) {
        if (!!container) {
            this.optionContainer = container;
            this.setCoords();
        }
    };

    @Output() closeModal: EventEmitter<undefined> = new EventEmitter();

    protected renderer: Renderer2 = inject(Renderer2);

    private optionContainer: ElementRef<HTMLDivElement> | undefined;

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

        const elem: HTMLElement | null = this.optionContainer.nativeElement.querySelector('.scrollbar-container');
        if (!elem) {
            return;
        }
        const observer = new ResizeObserver(entries => {
            entries.forEach(entry => {
                let contHeight: number = entry.borderBoxSize[0].blockSize
                if (window.innerHeight - coords.y - coords.height - contHeight > 0) {
                    this.renderer.setStyle(elem, 'top', '0px'); // place at bottom of parent
                    return;
                }
                if (coords.y > contHeight) {
                    this.renderer.setStyle(elem, 'top', -contHeight - coords.height + 'px'); // place at top of parent
                }
            });
        });
        observer.observe(elem);
    }

    onMousedown(event: MouseEvent, option: SelectOption<string, any>): void {
        event.stopPropagation();
        if (event.button) {
            return;
        }
        if (this.selectedId) {
            this.selectedId.set(option);
        }
        this.emitCloseModalEvent();
    }

    emitCloseModalEvent(): this {
        this.closeModal.emit();
        return this;
    }

    onKeypressWithInput($event: KeyboardEvent): void {
        if ($event.key !== 'Enter') {
            return;
        }
        if(this.displayedModels().size == 1) {
            for(const value of this.displayedModels()) {
                if(this._input == value.label) {
                    this.selectedId?.set(value);
                    this.emitCloseModalEvent();
                    return;
                }
            }
        }

        if (this.selectedId && $event.target instanceof HTMLInputElement) {
            this.selectedId.set(new SelectOption({
                id: ID_NEW_OPTION,
                value: $event.target.value,
                label: $event.target.value,
            }));
        }
        this.emitCloseModalEvent();
    }

    onInput(ev: Event) {
        if (ev instanceof InputEvent) {
            this.displayedModels.set(new ButtonListPopupModel);
            const _input: string = (ev.target as HTMLInputElement).value;
            for (const item of this._models.values()) {
                if (item.label.toLowerCase().includes(_input.toLowerCase()) && _input.toLowerCase()) {
                    this.displayedModels.update((value) => {
                        return value.add(item);
                    })
                }
            }

            this._input = _input;

            if (!_input) {
                this.displayedModels.set(this._models);
            }


            const cont: HTMLElement | undefined | null = this.optionContainer?.nativeElement.querySelector('.scrollbar-container');
            if (!!this.displayedModels().size) {
                if (cont) {
                    this.renderer.setStyle(cont, 'visibility', 'visible');
                }
            } else {
                if (cont) {
                    this.renderer.setStyle(cont, 'visibility', 'hidden');
                }
            }
        }

    }

    @HostListener('click') onClick() {
        this.emitCloseModalEvent();
    }
}
