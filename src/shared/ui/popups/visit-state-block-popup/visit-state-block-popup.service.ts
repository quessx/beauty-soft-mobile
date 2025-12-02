import { ElementRef, Injectable } from '@angular/core';
import { DefaultPopup } from 'beauty-soft-common';
import { VisitStateBlockPopupComponent } from '@ui/popups/visit-state-block-popup/visit-state-block-popup.component';
import { CalendarModalComponent } from '@lib/services/calendar-modal/calendar-modal.component';
import { AppointmentAppointmentRead } from '@api/model/appointmentAppointmentRead';

@Injectable({
    providedIn: 'root'
})
export class VisitStateBlockPopupService extends DefaultPopup<VisitStateBlockPopupComponent> {
    constructor() {
        super('visit-state-block-popup-ae', VisitStateBlockPopupComponent);
    }

    override setupVariables(elementRef: ElementRef, model: {
        states: AppointmentAppointmentRead.StateEnum[];
        selected?: string
    }, selectedId?: any, position: string = 'bottom', state: string = '', coords?: DOMRect): void {
        if (!this.popupEl) {
            throw new Error('Popup element not found');
        }
        this.popupEl.states = model.states;
        this.popupEl.selected = model.selected;
        this.popupEl.position = position;
        this.popupEl.parentElRef = elementRef;
        if (state) {
            this.popupEl.classList.add(state);
        }
        this.popupEl.parentCoords = coords;
    }
}
