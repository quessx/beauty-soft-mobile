import { ElementRef, Injectable, Signal, WritableSignal } from '@angular/core';
import { DefaultPopup } from 'beauty-soft-common';
import { SearchInputButtonListPopupComponent } from '@ui/popups/search-input-button-list-popup/search-input-button-list-popup.component';
import { ButtonListPopupModel } from '@ui/popups';

@Injectable({
  providedIn: 'root'
})
export class SearchInputButtonListPopupService extends DefaultPopup<SearchInputButtonListPopupComponent> {

    constructor() {
        super('beauty-search-input-button-list-popup-ae', SearchInputButtonListPopupComponent);
    }

    override setupVariables(
        elementRef: ElementRef,
        model: ButtonListPopupModel | Signal<ButtonListPopupModel>,
        selectedId: WritableSignal<string>,
        usedMask: string = '',
        searchSignal: WritableSignal<string> | undefined
    ): void {
        if (!this.popupEl) {
            throw new Error('Popup element not found');
        }
        this.popupEl.searchSignal = searchSignal;
        this.popupEl.model = model;
        this.popupEl.selectedId = selectedId;
        this.popupEl.parentElRef = elementRef;
        this.popupEl.usedMask = usedMask;
    }
}
