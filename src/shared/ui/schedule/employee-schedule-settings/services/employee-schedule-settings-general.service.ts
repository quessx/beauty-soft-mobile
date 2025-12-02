import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeScheduleSettingsGeneralService {
    private saveButtonSubject: Subject<undefined> = new Subject<undefined>();

    public onCreateEvent(): void {
        this.saveButtonSubject.next(undefined);
    }

    public getSaveButtonSubjectAsObservable(): Observable<undefined> {
        return this.saveButtonSubject.asObservable();
    }
}
