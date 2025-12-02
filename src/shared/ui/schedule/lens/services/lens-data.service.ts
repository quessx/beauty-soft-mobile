import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TLensQueueItem, TLensScrollPosition } from '../types/lens.types';

@Injectable({
    providedIn: 'root'
})
export class LensDataService {
    private lensQueue$: BehaviorSubject<TLensQueueItem | undefined> = new BehaviorSubject<TLensQueueItem | undefined>(undefined);
    private scrollPositionCallback: ((position: TLensScrollPosition) => void) | null = null;

    public enqueueLensItem(item: TLensQueueItem): void {
        this.lensQueue$.next(item);
    }

    public getLensQueue(): BehaviorSubject<TLensQueueItem | undefined> {
        return this.lensQueue$;
    }

    public setScrollPosition(position: TLensScrollPosition): void {
        this.scrollPositionCallback?.(position);
    }

    public onScrollPositionChange(callback: (position: TLensScrollPosition) => void): void {
        this.scrollPositionCallback = callback;
    }

}
