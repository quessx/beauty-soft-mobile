import { ElementRef, Injectable, WritableSignal } from '@angular/core';
import { DefaultPopup } from 'beauty-soft-common';
import { DiscountPickerPopupComponent } from '@ui/popups/discount-picker-popup/discount-picker-popup.component';

@Injectable({
  providedIn: 'root'
})
export class DiscountPickerPopupService extends DefaultPopup<DiscountPickerPopupComponent> {

    constructor() {
        super('bsm-discount-picker-popup-ae', DiscountPickerPopupComponent);
    }

    override setupVariables(elementRef: ElementRef, value: WritableSignal<string>): void {
        if (!this.popupEl) {
            throw new Error('Popup element not found');
        }
        this.popupEl.value = value;
        this.popupEl.parentEl = elementRef.nativeElement;
    }

    override hide(): this {

        return super.hide();
    }
}
