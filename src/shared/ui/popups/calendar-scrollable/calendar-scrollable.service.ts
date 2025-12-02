import { Injectable, signal, WritableSignal } from '@angular/core';
import { DefaultPopup } from '@lib/helpers/base-ae';
import { AppointmentLogComponentTypes } from '@lib/services/appointment-log';
import { CalendarScrollableComponent } from './calendar-scrollable.component';
import { TCalendarDate } from './types';


@Injectable({ providedIn: 'root' })
export class CalendarScrollableService extends DefaultPopup<CalendarScrollableComponent> {
    public weekDate: WritableSignal<TCalendarDate | null> = signal(null);

    constructor() {
        super('calendar-scrollable-ae', CalendarScrollableComponent);
    }

    override setupVariables(selectedDate: WritableSignal<TCalendarDate | null>, calendarType?: WritableSignal<AppointmentLogComponentTypes.scheduleState | null>): void {
        if (!this.popupEl) {
            return;
        }

        this.popupEl.weekDate = this.weekDate();
        this.popupEl.selectedDate = selectedDate;
        this.popupEl.calendarType = calendarType;

    }

    override show(selectedDate: WritableSignal<TCalendarDate | null>, calendarType?: WritableSignal<AppointmentLogComponentTypes.scheduleState | null>): this {
        super.show(selectedDate, calendarType);
        return this;
    }
}

