import { Injectable, signal, WritableSignal } from '@angular/core';
import { TStateLeftMenu } from '@lib/services/appointment';
import { EmployeeGeneralService } from '@lib/services/employee';

@Injectable({
    providedIn: 'root'
})
export class SoldGoodsGeneralService extends EmployeeGeneralService {
    public onNewPayEvent: WritableSignal<boolean> = signal(false);
    public onPayEvent: WritableSignal<boolean> = signal(false);
    public stateLeftMenu: WritableSignal<TStateLeftMenu> = signal('change');
}
