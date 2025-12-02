import {ElementRef, Injectable, Renderer2, WritableSignal} from '@angular/core';
import { InputButtonListPopupComponent } from './input-button-list-popup.component';
import { ButtonListPopupModel } from '../button-list-popup/button-list-popup.model';
import { DefaultPopup } from 'beauty-soft-common';
import { SelectOption } from '@lib/types/SelectOption.class';

@Injectable({
    providedIn: 'root'
})
export class InputButtonListPopupService extends DefaultPopup<InputButtonListPopupComponent> {

    constructor() {
        super('beauty-input-button-list-popup-ae', InputButtonListPopupComponent);
    }
    override setupVariables(elementRef: ElementRef, model: ButtonListPopupModel, selectedId?: WritableSignal<SelectOption | undefined>, state?: string): void {
        if (!this.popupEl) {
            throw new Error('Popup element not found');
        }
        this.popupEl.model = model;
        this.popupEl.selectedId = selectedId;
        this.popupEl.parentElRef = elementRef;

        if (state) {
            this.popupEl.classList.add(state);
        }
    }
}
