import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, Renderer2, inject, viewChild, Signal } from '@angular/core';
import { AppointmentAppointmentRead } from '@api/model/appointmentAppointmentRead';
import { VisitStateButtonComponent } from '@ui/buttons/visit-state-button';
import { Element } from '@angular/compiler';

@Component({
    selector: 'bsm-visit-state-block-popup',
    imports: [VisitStateButtonComponent],
    templateUrl: './visit-state-block-popup.component.html',
    styleUrl: './visit-state-block-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitStateBlockPopupComponent {
    @Input() public states: Array<AppointmentAppointmentRead.StateEnum> = [];
    @Input() public selected?: string;
    @Input() public position: string = 'bottom';
    @Input() public parentElRef?: ElementRef;
    @Input() public parentCoords?: DOMRect;

    @ViewChild('cont') set cont(container: ElementRef<HTMLDivElement> | undefined) {
        if (!!container) {
            this.optionContainer = container;
            this.setCoords();
            this.setPosition();
        }
    };

    @Output() closeModal: EventEmitter<undefined> = new EventEmitter();
    @Output() onChange: EventEmitter<string> = new EventEmitter();

    protected renderer: Renderer2 = inject(Renderer2);
    private optionContainer: ElementRef | undefined;

    setCoords(): void {
        if (!this.optionContainer || !this.parentCoords) {
            return;
        }

        this.renderer.setStyle(this.optionContainer.nativeElement, 'right', (window.innerWidth - this.parentCoords.right) + 'px');
    }

    setPosition(): void {
        if (!this.parentElRef || !this.optionContainer) {
            return
        }
        const elem: HTMLElement = this.optionContainer.nativeElement
        const contOffset: number = 6
        let coords: DOMRect = this.parentElRef.nativeElement.getBoundingClientRect();

        const observer = new ResizeObserver(entries => {
            entries.forEach(entry => {
                let contHeight: number = entry.borderBoxSize[0].blockSize
                if (window.innerHeight - coords.y - coords.height - contHeight > 0 && this.position !== 'top') {
                    this.renderer.setStyle(elem, 'top', coords.y + coords.height + contOffset + 'px'); // place at bottom of parent
                    return
                }
                if (coords.y > contHeight) {
                    this.renderer.setStyle(elem, 'top', coords.y - contHeight - contOffset + 'px'); // place at top of parent
                }
            });
        });

        observer.observe(elem);
    }

    onMousedown(event: MouseEvent, state: string): void {
        if (event.button) {
            return;
        }
        this.onChange.emit(state);
        this.emitCloseModalEvent();
    }

    emitCloseModalEvent(): this {
        this.closeModal.emit();
        return this;
    }

    @HostListener('document:mousedown', ['$event.target']) onHostClick(targetElement: HTMLElement): void {
        if (this.optionContainer && !this.optionContainer.nativeElement.contains(targetElement as Node)) {
            this.emitCloseModalEvent();
        }
    }
}
