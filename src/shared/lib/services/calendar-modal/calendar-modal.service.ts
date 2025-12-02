import { ElementRef, Injectable, WritableSignal } from '@angular/core';
import { DefaultPopup } from '@lib/helpers/base-ae';
import { CalendarModalComponent } from '@lib/services/calendar-modal/calendar-modal.component';
import { TCalendarDate } from '@ui/popups/calendar-scrollable';

@Injectable({
    providedIn: 'root'
})
export class CalendarModalService extends DefaultPopup<CalendarModalComponent> {
    constructor() {
        super('calendar-modal-ae', CalendarModalComponent);
    }

    override setupVariables(parentRef: ElementRef, selectedDate?: WritableSignal<TCalendarDate | null>): void {
        if (!this.popupEl) {
            return;
        }
        this.popupEl.parentEl = parentRef.nativeElement;
        this.popupEl.selectedDate = selectedDate;
    }

    override show(parentRef: ElementRef, selectedDate?: WritableSignal<TCalendarDate | null>): this {
        super.show(parentRef, selectedDate);
        return this;
    }

    override hide(): this {
        this.popupEl?.animate(
            { opacity: [1, 0] },
            {
                duration: 500,
                easing: 'linear'
            }
        );
        this.popupEl?.children[0]?.animate(
            { transform: ['translateY(0)', 'translateY(99%)'] },
            {
                duration: 500,
                easing: 'ease-in'
            }
        ).finished.then(super.hide.bind(this));
        return this;
    }
}
