import { ElementRef, Injectable, WritableSignal } from '@angular/core';
import { DefaultPopup } from '@lib/helpers/base-ae';
import { SpecialistPopupComponent } from '@ui/popups/specialist-popup/specialist-popup.component';
import { PositionsTableItem } from '@entities/speciality';
import { SpecialistPopupTypesClass } from '@ui/popups/specialist-popup';

@Injectable({
    providedIn: 'root'
})
export class SpecialistPopupService extends DefaultPopup<SpecialistPopupComponent> {
    constructor() {
        super('bsm-specialist-popup-ae', SpecialistPopupComponent);
    }

    setupVariables(elementRef: ElementRef, options: WritableSignal<PositionsTableItem[]>, selectedOption: WritableSignal<string>, searchTerm: WritableSignal<string>, texts: SpecialistPopupTypesClass): void {
        if (!this.popupEl) {
            throw new Error('Popup element not found');
        }

        this.popupEl.parentEl = elementRef.nativeElement;
        this.popupEl.options = options;
        this.popupEl.selectedOption = selectedOption;
        this.popupEl.searchTerm = searchTerm;
        this.popupEl.texts = texts;
    }

}
