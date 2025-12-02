import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class AddOrderPopupFeatureService {
    public selectedValue: WritableSignal<string[]> = signal([]);
    public values: WritableSignal<string[]> = signal([]);
}
