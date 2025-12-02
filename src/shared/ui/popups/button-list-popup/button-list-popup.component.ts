import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, Renderer2, ViewChild, WritableSignal } from '@angular/core';
import { ButtonListPopupModel, ButtonListPopupModelOptionMetadata } from './button-list-popup.model';
import { TranslatePipe } from '@i18n/translate.pipe';
import { TPopupPosition } from './button-list-popup.types';
import { NgClass } from '@angular/common';
import { SelectOption } from '@lib/types/SelectOption.class';
import { CheckMarkIconComponent } from '@icons/check-mark-icon';

@Component({
    selector: 'beauty-button-list-popup',
    imports: [TranslatePipe, CheckMarkIconComponent, NgClass],
    templateUrl: './button-list-popup.component.html',
    styleUrls: ['../../../../shared/lib/helpers/css/popup.base.css', './button-list-popup.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonListPopupComponent {
    @Input() model: ButtonListPopupModel = new ButtonListPopupModel();
    @Input() parentElRef: ElementRef | undefined = undefined;
    @Input() selectedId: WritableSignal<SelectOption | undefined> | undefined = undefined;
    @Input() position: TPopupPosition = 'right';
    @Input() parentCoords?: DOMRect;

    @ViewChild('cont') set cont(container: ElementRef<HTMLDivElement> | undefined) {
        if (!!container) {
            this.optionContainer = container;
            this.setCoords();
            this.setWidth();
            this.setPosition();
        }
    };

    @Output() closeModal: EventEmitter<undefined> = new EventEmitter();

    protected renderer: Renderer2 = inject(Renderer2);

    private optionContainer: ElementRef | undefined;

    setCoords(): void {
        if (!this.optionContainer || !this.parentCoords) {
            return;
        }

        this.renderer.setStyle(this.optionContainer.nativeElement, 'right', (window.innerWidth - this.parentCoords.right) + 'px');
        // if (this.position === 'right') {
        //     this.renderer.setStyle(this.optionContainer.nativeElement, 'right', (coords.right) + 'px');
        // } else if (this.position === 'left') {
        //     this.renderer.setStyle(this.optionContainer.nativeElement, 'left', coords.left + 'px');
        // }
    }

    /**
     * set width like parent */
    setWidth(): void {
        if (!this.parentElRef || !this.optionContainer) {
            return;
        }
        let coords: DOMRect = this.parentElRef.nativeElement.getBoundingClientRect();
        this.renderer.setStyle(this.optionContainer.nativeElement, 'width', coords.width - 2 + 'px');
    }

    /**
     * set position top|bottom of parent */
    setPosition(): void {
        if(!this.parentElRef || !this.optionContainer) {
            return
        }
        const elem: HTMLElement = this.optionContainer.nativeElement
        const contOffset: number = 4
        let coords: DOMRect = this.parentElRef.nativeElement.getBoundingClientRect();

        const observer = new ResizeObserver(entries => {
            entries.forEach(entry => {
                let contHeight: number = entry.borderBoxSize[0].blockSize
                if(window.innerHeight - coords.y - coords.height - contHeight > 0) {
                    this.renderer.setStyle(elem, 'top', coords.y + coords.height + contOffset + 'px'); // place at bottom of parent
                    return
                }
                if(coords.y > contHeight) {
                    this.renderer.setStyle(elem, 'top', coords.y - contHeight - contOffset + 'px'); // place at top of parent
                }
            });
        });

        observer.observe(elem);
    }

    onMousedown(event: MouseEvent, option: SelectOption<string, ButtonListPopupModelOptionMetadata>): void {
        if (event.button) {
            return;
        }
        if (this.selectedId) {
            this.selectedId.set(option);
        } else {
            option.metadata?.callback();
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
}
