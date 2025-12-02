import { ElementRef, Injectable, WritableSignal } from '@angular/core';
import { DatepickerPopupComponent } from './datepicker-popup.component';
import { DefaultPopup } from 'beauty-soft-common';

@Injectable({
    providedIn: 'root'
})
export class DatepickerPopupService extends DefaultPopup<DatepickerPopupComponent> {

    constructor() {
        super('beauty-datepicker-popup-ae', DatepickerPopupComponent);
    }

    override setupVariables(elementRef: ElementRef, date: WritableSignal<string>): void {
        if (!this.popupEl) {
            throw new Error('Popup element not found');
        }
        this.popupEl.date = date;
        this.popupEl.parentElRef = elementRef;
    }

    override hide(): this {

        return super.hide();
    }
}
