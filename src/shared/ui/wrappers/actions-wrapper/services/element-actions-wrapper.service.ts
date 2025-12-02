import { ElementRef, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable( {
    providedIn: 'root'
} )
export class ElementActionsWrapperService {
    public actionsWrapperRef: WritableSignal<ElementRef | undefined> = signal(undefined);
    public scrollTop: WritableSignal<number | undefined> = signal(undefined);
    public onCloseWrapper: Subject<undefined> = new Subject<undefined>();

    setOnCloseWrapper(): void {
        this.onCloseWrapper.next(undefined);
    }
    getOnCloseWrapper(): Observable<undefined> {
        return this.onCloseWrapper.asObservable();
    }
}
