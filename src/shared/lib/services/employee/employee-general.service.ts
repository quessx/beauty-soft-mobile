import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmployeeGeneralService {
    private saveButtonSabject: Subject<undefined> = new Subject<undefined>();
    private removeButtonSubject: Subject<undefined> = new Subject<undefined>();
    private payButtonSubject: Subject<undefined> = new Subject<undefined>();
    private payUpdateButtonSubject: Subject<undefined> = new Subject<undefined>();
    private addOrderSubject: Subject<undefined> = new Subject<undefined>();

    public onCreateEvent(): void {
        this.saveButtonSabject.next(undefined);
    }

    public onPayAppointment(): void {
        this.payButtonSubject.next(undefined);
    }

    public onUpdateAppointment(): void {
        this.payUpdateButtonSubject.next(undefined);
    }

    public onAddOrderEvent(): void {
        this.addOrderSubject.next(undefined);
    }

    public onRemoveEvent(): void {
        this.removeButtonSubject.next(undefined);
    }
    public getSaveButtonSabjectAsObservable(): Observable<undefined> {
        return this.saveButtonSabject.asObservable();
    }

    public getRemoveButtonSubjectAsObservable(): Observable<undefined> {
        return this.removeButtonSubject.asObservable();
    }

    public getPayButtonSubjectAsObservable(): Observable<undefined> {
        return this.payButtonSubject.asObservable();
    }

    public getPayUpdateButtonSubjectAsObservable(): Observable<undefined> {
        return this.payUpdateButtonSubject.asObservable();
    }

    public getAddOrderSubjectAsObservable(): Observable<undefined> {
        return this.addOrderSubject.asObservable();
    }
}
