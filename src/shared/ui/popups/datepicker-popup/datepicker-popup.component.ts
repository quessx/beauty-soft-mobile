import { afterNextRender, AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, EventEmitter, HostListener, inject, Input, Output, Renderer2, Signal, WritableSignal } from '@angular/core';
import { TuiCalendar } from '@taiga-ui/core';
import { TuiDay } from '@taiga-ui/cdk';

@Component({
    selector: 'beauty-datepicker-popup',
    imports: [TuiCalendar],
    templateUrl: './datepicker-popup.component.html',
    styleUrls: ['./datepicker-popup.component.css'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerPopupComponent implements AfterViewInit {
    @Input() parentElRef: ElementRef | undefined = undefined;
    @Input() date: WritableSignal<string> | undefined = undefined;

    @Output() closeModal: EventEmitter<undefined> = new EventEmitter();
    @Output() onChange: EventEmitter<undefined> = new EventEmitter();

    public value: Signal<TuiDay | null> = computed(() => {
        if (!this.date) {
            return null;
        }
        let dates: string[] = this.date().split('/');
        if (dates.length !== 3) {
            return null;
        }
        return new TuiDay(Number(dates[2]), Number(dates[1]) - 1, Number(dates[0]));
    });

    private elementRef: ElementRef = inject(ElementRef);
    private renderer: Renderer2 = inject(Renderer2);
    private currDate: Date = new Date();
    public maxDate: TuiDay = new TuiDay(this.currDate.getFullYear(), this.currDate.getMonth() + 3, this.currDate.getDate());
    public minDate: TuiDay = new TuiDay(this.currDate.getFullYear() - 100, this.currDate.getMonth(), this.currDate.getDate());

    constructor(elementRef: ElementRef, renderer: Renderer2) {
        afterNextRender(() => {
            if (!this.parentElRef) {
                return;
            }
            const coords: DOMRect = this.parentElRef.nativeElement.getBoundingClientRect();
            const cont: HTMLDivElement = elementRef.nativeElement.querySelector('.popup-container');
            this.renderer.setStyle(cont, 'top', `${coords.y - 310 - coords.height - 7}px`);
        });
    }

    onDateChange(date: TuiDay): void {
        this.date?.set(`${date.formattedDayPart}/${date.formattedMonthPart}/${date.formattedYear}`);
        this.emitCloseModalEvent();
    }

    emitCloseModalEvent(): this {
        this.onChange.emit();
        this.closeModal.emit();
        return this;
    }

    ngAfterViewInit() {
    }

    private positionRelativeToInput() {
        const popupContainer: HTMLDivElement = this.elementRef.nativeElement.querySelector('.popup-container');
        if (!popupContainer || !this.parentElRef) {
            return;
        };

        const inputElement: HTMLInputElement = this.parentElRef.nativeElement.querySelector('input');

        const inputRect: DOMRect = inputElement.getBoundingClientRect();

        this.renderer.setStyle(popupContainer, 'top', `${inputRect.bottom + 3}px`);
        this.renderer.setStyle(popupContainer, 'left', `${inputRect.left}px`);
    }

    @HostListener('document:touchstart', ['$event']) onMouseDown(event: Event) {
        let clickedInside: boolean = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.emitCloseModalEvent();
        }
    }
}
