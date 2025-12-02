import { Injectable, WritableSignal } from '@angular/core';
import { DefaultPopup } from '@lib/helpers/base-ae/default-popup.class';
import { SelectOption } from '@lib/types/SelectOption.class';
import { RadioPopupComponent } from './radio-popup.component';

@Injectable()
export class RadioPopupService extends DefaultPopup<RadioPopupComponent> {
    constructor() {
        super('radio-popup-ae', RadioPopupComponent);
    }

    override setupVariables(options: SelectOption[], selected: WritableSignal<string>, centerText: string, entitiesTitle: string): void {
        if (!this.popupEl) {
            throw new Error('Popup element not found');
        }

        this.popupEl.entities = options;
        this.popupEl.selected = selected;
        this.popupEl.centerText = centerText;
        this.popupEl.entitiesTitle = entitiesTitle;
    }

    override show(options: SelectOption[], selected: WritableSignal<string>, centerText: string, entitiesTitle: string): this {
        super.show(options, selected, centerText, entitiesTitle);
        return this;
    }

}
