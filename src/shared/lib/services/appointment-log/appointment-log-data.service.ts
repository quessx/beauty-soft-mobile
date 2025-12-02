import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { AppointmentsFilter, AppointmentsStore, IAppointmentsStore } from '@entities/appointments';
import { ClientsStore, IClientsStore } from '@entities/clients';
import { AppointmentDataService } from '@lib/services/appointment';
import { SelectOption } from '@lib/types/SelectOption.class';
import { patchState } from '@ngrx/signals';
import { TCalendarDate } from '@ui/popups/calendar-scrollable';
import { TNavPanelOption } from 'beauty-soft-common';
import { AppointmentLogLoadService } from './appointment-log-load.service';
import { AppointmentLogComponentTypes } from './appointment-log.types';
import { EmployeesStore, IEmployeesStore } from '@entities/employees';

@Injectable({
    providedIn: 'root'
})
export class AppointmentLogDataService {
    public selectedDate: WritableSignal<TCalendarDate | null> = signal(null);
    public scheduleState: WritableSignal<AppointmentLogComponentTypes.scheduleState> = signal(AppointmentLogComponentTypes.scheduleState.day);
    public scheduleStateConst: typeof AppointmentLogComponentTypes.scheduleState = AppointmentLogComponentTypes.scheduleState;
    public appointmentLogLoadService: AppointmentLogLoadService = inject(AppointmentLogLoadService);
    private appointmentDataService: AppointmentDataService = inject(AppointmentDataService);
    private appointmentsStore: IAppointmentsStore = inject(AppointmentsStore);
    private clientsStore: IClientsStore = inject(ClientsStore);
    private employeesStore: IEmployeesStore = inject(EmployeesStore);

    constructor() {
    }

    onExpanded(link: string | undefined, options: TNavPanelOption[]): void {
        if (link === 'employees') {
            let optionIndex: number | undefined = options.findIndex((option: TNavPanelOption) => {
                return option.path === this.employeesStore.selectedId();
            });
            if (optionIndex !== -1) {
                options[optionIndex].active = true;
            }
        }
    }

    onExpandedClick(option: TNavPanelOption): void {
        if (option.link === 'booking') {
            const selectOption: SelectOption = {
                id: option?.path + '',
                value: option?.path + '',
                label: option?.path + '',
                metadata: 'todo',
            };
        }
    }

    loadVisitHistory(): void {
        let clientId: string | undefined = this.appointmentDataService.getClientForm().get('phone')?.value;
        if (!clientId) {
            return;
        }
        let appointmentsFilter: AppointmentsFilter = new AppointmentsFilter();
        appointmentsFilter.setFilterByName('itemsPerPage', 30);
        appointmentsFilter.setFilterByName('xAppointmentItems', '1');
        appointmentsFilter.setFilterByName('xScheduleDay', '1');
        appointmentsFilter.setFilterByName('xPayment', '1');
        appointmentsFilter.setFilterByName('xDiscounts', '1');
        patchState(this.appointmentsStore, {isLoading: false, filter: appointmentsFilter});
        patchState(this.clientsStore, {selectedId: clientId});
        this.appointmentsStore.loadByClientId(clientId);
    }
}
