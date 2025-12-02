import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ApiAppointmentsGetCollection200Response, ApiPublicemployeesEmployeeIdworkScheduleDaysGetCollection200Response, AppointmentJsonldAppointmentRead } from '@api/index';
import { AppointmentsCollectionFilter, AppointmentsStore } from '@entities/appointments';
import { ClientFilter, ClientsStore } from '@entities/clients';
import { EmployeesStore } from '@entities/employees';
import { ISpecialityStore, SpecialityStore } from '@entities/speciality';
import { IWorkScheduleDaysStore, WorkScheduleDayFilter, WorkScheduleDaysStore } from '@entities/work-schedule-day';
import { patchState } from '@ngrx/signals';
import moment from 'moment';
import { take } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppointmentLogLoadService {
    private workScheduleDaysStore: IWorkScheduleDaysStore = inject(WorkScheduleDaysStore);
    private appointmentsStore = inject(AppointmentsStore);
    private clientsStore = inject(ClientsStore);
    private employeesStore = inject(EmployeesStore);
    private specialityStore: ISpecialityStore = inject(SpecialityStore);
    public readonly showLoadingOverlay: WritableSignal<boolean> = signal(false);

    private isLoading: WritableSignal<boolean> = signal(false);

    constructor() {
        effect(() => {
            if(this.isLoading()) {
                this.showLoadingOverlay.set(false);
            }
        })
    }

    getIsLoading(): WritableSignal<boolean> {
        return this.isLoading;
    }

    loadDayData(dateMoment: moment.Moment): void {
        this.isLoading.set(false);
        let workScheduleDayFilter = new WorkScheduleDayFilter();
        workScheduleDayFilter.setFilterByName('dayAfter', dateMoment.format('DD-MM-YYYY'));
        workScheduleDayFilter.setFilterByName('dayBefore', dateMoment.format('DD-MM-YYYY'));
        patchState(this.workScheduleDaysStore, { filter: workScheduleDayFilter });
        this.workScheduleDaysStore.loadByFilter().pipe(take(1)).subscribe({
            next: (days: ApiPublicemployeesEmployeeIdworkScheduleDaysGetCollection200Response) => {
                let appointmentsCollectionFilter: AppointmentsCollectionFilter = new AppointmentsCollectionFilter();
                appointmentsCollectionFilter.setFilterByName('dayAfter', dateMoment.format('DD-MM-YYYY'));
                appointmentsCollectionFilter.setFilterByName('dayBefore', dateMoment.format('DD-MM-YYYY'));
                appointmentsCollectionFilter.setFilterByName('xAppointmentItems', '1');
                appointmentsCollectionFilter.setFilterByName('xDiscounts', '1');
                appointmentsCollectionFilter.setFilterByName('xPayment', '1');
                appointmentsCollectionFilter.setFilterByName('xScheduleDay', '1');
                this.appointmentsStore.loadByFilter(appointmentsCollectionFilter).pipe(take(1)).subscribe({
                    next: (appointments: ApiAppointmentsGetCollection200Response) => {
                        let clientIds: string[] = appointments.member.map((appointment: AppointmentJsonldAppointmentRead) => {
                            return appointment.client?.id || '';
                        });
                        clientIds = clientIds.filter((clientId: string) => !this.clientsStore.entityMap()[clientId]);
                        if (!clientIds.length) {
                            this.isLoading.set(true);
                            return;
                        }
                        let clientFilter: ClientFilter = new ClientFilter();
                        clientFilter.setFilterByName('itemsPerPage', undefined);
                        clientFilter.setFilterByName('page', undefined);
                        clientFilter.setFilterByName('xClientLastAppointment', '1');
                        clientFilter.setFilterByName('xAppointmentsCount', '1');
                        clientFilter.setFilterByName('xTotalSold', '1');
                        clientFilter.setFilterByName('id2', clientIds.filter((e, i, self) => i === self.indexOf(e)));
                        this.clientsStore.loadByFilterTemporaryData(clientFilter).pipe(take(1)).subscribe({
                            next: () => { this.isLoading.set(true); },
                            error: (error: any) => { console.error('Error loading clients:', error); },
                            complete: () => {
                                this.isLoading.set(true);
                            }
                        });
                    }
                });
            }
        });
    }

    loadRangeData(startDateMoment: moment.Moment, endDateMoment: moment.Moment): void {
        this.isLoading.set(false);
        let workScheduleDayFilter = new WorkScheduleDayFilter();
        workScheduleDayFilter.setFilterByName('dayAfter', startDateMoment.format('DD-MM-YYYY'));
        workScheduleDayFilter.setFilterByName('dayBefore', endDateMoment.format('DD-MM-YYYY'));
        workScheduleDayFilter.setFilterByName('employee', this.employeesStore.selectedId());
        patchState(this.workScheduleDaysStore, { filter: workScheduleDayFilter });
        this.workScheduleDaysStore.loadByFilter().pipe(take(1)).subscribe({
            next: (days: ApiPublicemployeesEmployeeIdworkScheduleDaysGetCollection200Response) => {
                let appointmentsCollectionFilter: AppointmentsCollectionFilter = new AppointmentsCollectionFilter();
                appointmentsCollectionFilter.setFilterByName('dayAfter', startDateMoment.format('DD-MM-YYYY'));
                appointmentsCollectionFilter.setFilterByName('dayBefore', endDateMoment.format('DD-MM-YYYY'));
                appointmentsCollectionFilter.setFilterByName('xAppointmentItems', '1');
                appointmentsCollectionFilter.setFilterByName('xScheduleDay', '1');
                appointmentsCollectionFilter.setFilterByName('employee', this.employeesStore.selectedId());
                this.appointmentsStore.loadByFilter(appointmentsCollectionFilter).pipe(take(1)).subscribe({
                    next: (appointments: ApiAppointmentsGetCollection200Response) => {
                        let clientIds: string[] = appointments.member.map((appointment: AppointmentJsonldAppointmentRead) => {
                            return appointment.client?.id || '';
                        });
                        clientIds = clientIds.filter((clientId: string) => !this.clientsStore.entityMap()[clientId]);
                        if (!clientIds.length) {
                            this.isLoading.set(true);
                            return;
                        }
                        let clientFilter: ClientFilter = new ClientFilter();
                        clientFilter.setFilterByName('itemsPerPage', undefined);
                        clientFilter.setFilterByName('page', undefined);
                        clientFilter.setFilterByName('xClientLastAppointment', '1');
                        clientFilter.setFilterByName('xAppointmentsCount', '1');
                        clientFilter.setFilterByName('xTotalSold', '1');
                        clientFilter.setFilterByName('id2', clientIds.filter((e, i, self) => i === self.indexOf(e)));
                        this.clientsStore.loadByFilterTemporaryData(clientFilter).pipe(take(1)).subscribe({
                            next: () => { this.isLoading.set(true) },
                            error: (error: any) => { console.error('Error loading clients:', error); },
                            complete: () => {
                                this.isLoading.set(true);
                            }
                        });
                    }
                });
            }
        });
    }
}
