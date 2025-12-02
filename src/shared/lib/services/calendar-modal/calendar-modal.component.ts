import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, Injector, input, InputSignal, Renderer2, Signal, signal, viewChild, ViewChild, WritableSignal, output, OutputEmitterRef, OnInit } from '@angular/core';
import { TCalendarDate } from '@ui/popups/calendar-scrollable';
import { LanguageService, TranslatePipe } from 'beauty-soft-common';
import { langData } from '@ui/popups/calendar-scrollable';
import { AppointmentLogComponentTypes } from '@lib/services/appointment-log';

@Component({
    selector: 'bsm-calendar-modal',
    imports: [],
    templateUrl: './calendar-modal.component.html',
    styleUrl: './calendar-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarModalComponent implements OnInit {
    public currentYear = signal(new Date().getFullYear());
    public currentMonth = signal(new Date().getMonth());
    public parentEl: InputSignal<HTMLElement> = input.required();
    public selectedDate?: WritableSignal<TCalendarDate | null>;
    public calendarType?: WritableSignal<AppointmentLogComponentTypes.scheduleState | null>;

    public closeModal: OutputEmitterRef<void> = output();

    private renderer: Renderer2 = inject(Renderer2);

    @ViewChild('optionsContainer') set optionsContainer(element: ElementRef<HTMLDivElement>) {
        let parentCoords: DOMRect = this.parentEl().getBoundingClientRect();
        this.renderer.setStyle(element.nativeElement, 'top', parentCoords.top - element.nativeElement.getBoundingClientRect().height - 7 + 'px');
        this.renderer.setStyle(element.nativeElement, 'left', parentCoords.left + 'px');
    }

    constructor() {
        LanguageService.setLangData(langData[LanguageService.getLangStatic()]);
    }

    ngOnInit(): void {
        // Инициализируем календарь с текущей выбранной датой
        if (this.selectedDate && this.selectedDate()) {
            const date = this.selectedDate();
            if (date) {
                this.currentYear.set(date.year);
                this.currentMonth.set(date.month);
            }
        }
    }

    onClose(): void {
        this.closeModal.emit();
    }

    onDateSelect(date: TCalendarDate): void {
        if (this.selectedDate) {
            this.selectedDate.set(date);
        }
        this.onClose();
    }

    onDateChange(dateData: { year: number; month: number }): void {
        this.currentYear.set(dateData.year);
        this.currentMonth.set(dateData.month);
    }
}
