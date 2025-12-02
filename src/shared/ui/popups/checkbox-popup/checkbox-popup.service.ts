import { Injectable, WritableSignal } from '@angular/core';
import { DefaultPopup } from '@lib/helpers/base-ae/default-popup.class';
import { CheckboxPopupComponent } from './checkbox-popup.component';
import { SelectOptionCheckbox } from './types';

@Injectable()
export class CheckboxPopupService extends DefaultPopup<CheckboxPopupComponent> {
    constructor() {
        super('checkbox-popup-ae', CheckboxPopupComponent);
    }

    override setupVariables(options: WritableSignal<SelectOptionCheckbox[]>, centerText: string, entitiesTitle: string): void {
        if (!this.popupEl) {
            throw new Error('Popup element not found');
        }

        this.popupEl.entities = options;
        this.popupEl.centerText = centerText;
        this.popupEl.entitiesTitle = entitiesTitle;
    }

    override show(options: WritableSignal<SelectOptionCheckbox[]>, centerText: string, entitiesTitle: string): this {
        super.show(options, centerText, entitiesTitle);
        return this;
    }
}
