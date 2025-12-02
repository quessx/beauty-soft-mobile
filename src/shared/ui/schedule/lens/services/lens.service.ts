import { inject, Injectable } from '@angular/core';
import { DefaultPopup } from 'beauty-soft-common';
import { LensComponent } from '../lens.component';
import { TLensQueueItem, TLensScrollPosition } from '../types/lens.types';
import { LensDataService } from './lens-data.service';

@Injectable({
    providedIn: 'root'
})
export class LensService extends DefaultPopup<LensComponent> {

    private lensDataService: LensDataService = inject(LensDataService);

    constructor() {
        super('bsm-lens-ae', LensComponent);
    }

    public enqueueLensItem(item: TLensQueueItem): void {
        this.lensDataService.enqueueLensItem(item);
    }

    public setScrollPosition(position: TLensScrollPosition): void {
        this.lensDataService.setScrollPosition(position);
    }

    override setupVariables(): void {
        if (!this.popupEl) {
            throw new Error('Popup element not found');
        }
    }
}