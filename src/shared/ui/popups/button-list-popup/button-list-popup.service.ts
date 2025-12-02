import { ElementRef, Injectable, WritableSignal } from '@angular/core';
import { ButtonListPopupComponent } from './button-list-popup.component';
import { ButtonListPopupModel } from './button-list-popup.model';
import { TPopupPosition } from './button-list-popup.types';
import { SelectOption } from '@lib/types/SelectOption.class';
import { DefaultPopup } from '@lib/helpers/base-ae';

@Injectable({
    providedIn: 'root'
})
export class ButtonListPopupService extends DefaultPopup<ButtonListPopupComponent> {

    constructor() {
        super('button-list-popup-ae', ButtonListPopupComponent);
    }
    override setupVariables(elementRef: ElementRef, model: ButtonListPopupModel, selectedId?: WritableSignal<SelectOption | undefined>, position: TPopupPosition = 'right', state: string = '', coords?: DOMRect): void {
        if (!this.popupEl) {
            throw new Error('Popup element not found');
        }
        this.popupEl.model = model;
        this.popupEl.position = position;
        this.popupEl.selectedId = selectedId;
        this.popupEl.parentElRef = elementRef;
        if (state) {
            this.popupEl.classList.add(state);
        }
        this.popupEl.parentCoords = coords;
    }
}
