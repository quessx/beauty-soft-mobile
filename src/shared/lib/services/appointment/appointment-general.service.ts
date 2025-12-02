import { Injectable, signal, WritableSignal } from '@angular/core';
import { TStateLeftMenu } from './appointment-data.types';
import { EmployeeGeneralService } from '../employee';

@Injectable({
    providedIn: 'root'
})
export class AppointmentGeneralService extends EmployeeGeneralService {
    public onEndSaveEvent: WritableSignal<boolean> = signal(false);
    public onSaveEvent: WritableSignal<boolean> = signal(false);
    public stateLeftMenu: WritableSignal<TStateLeftMenu> = signal('change');
    public activeSaveButton: WritableSignal<boolean> = signal(false);
}
