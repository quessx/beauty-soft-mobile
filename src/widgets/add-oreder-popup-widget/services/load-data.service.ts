import { inject, Injectable, Injector } from '@angular/core';
import { combineLatest, filter, first, mergeMap, Observable, of } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { EmployeeServiceStore, IEmployeeServiceStore } from '@entities/employee-service';
import { AppointmentsStore, IAppointmentsStore } from '@entities/appointments';
import { IServiceGroupsStore, ServiceGroupsStore } from '@entities/service-groups';
import { GoodGroupsStore, IGoodGroupsStore } from '@entities/good-groups';
import { EmployeesStore, IEmployeesStore } from '@entities/employees';
import { AppointmentJsonldAppointmentRead } from '@api/model/appointmentJsonldAppointmentRead';
import { ILoyaltyCardStore, LoyaltyCardStore } from '@entities/loyalty-card';
import { ClientsStore, IClientsStore } from '@entities/clients';

@Injectable( {
    providedIn: 'root'
} )
export class LoadDataService {
    private serviceGroupsStore: IServiceGroupsStore = inject( ServiceGroupsStore );
    private employeeServiceStore: IEmployeeServiceStore = inject( EmployeeServiceStore );
    private goodGroupsStore: IGoodGroupsStore = inject( GoodGroupsStore );
    private appointmentsStore: IAppointmentsStore = inject( AppointmentsStore );
    private employeesStore: IEmployeesStore = inject( EmployeesStore );
    private _inj: Injector = inject( Injector );

    public constructor() {
    }

    public loadData(): Observable<boolean> {
        const appointmentId: string = this.appointmentsStore.selectedId();
        const appointment: AppointmentJsonldAppointmentRead = this.appointmentsStore.entityMap()[ appointmentId ];

        !this.employeeServiceStore.isEmployeeLoaded() && this.employeeServiceStore.loadById(appointment?.scheduleDay?.employee?.id);
        !this.serviceGroupsStore.isLoading() && this.serviceGroupsStore.loadByFilter();
        !this.goodGroupsStore.isLoading() && this.goodGroupsStore.loadByFilter();
        !this.employeesStore.isLoading() && this.employeesStore.loadByFilter();

        type isLoading = [ boolean, boolean, boolean, boolean];
        return combineLatest([
            toObservable(this.employeeServiceStore.isEmployeeLoaded, { injector: this._inj }),
            toObservable(this.serviceGroupsStore.isLoading, { injector: this._inj }),
            toObservable(this.goodGroupsStore.isLoading, { injector: this._inj }),
            toObservable(this.employeesStore.isLoading, { injector: this._inj }),
        ]).pipe(
            filter(([
                        isEmploeeServicesLoaded,
                        isServiceGroupsLoaded,
                        isGoodGroupsLoaded,
                        isEmployeesStoreLoaded,
                    ]: isLoading) => {
                let isAllStoresLoaded: boolean = !!isServiceGroupsLoaded && !!isGoodGroupsLoaded && !!isEmployeesStoreLoaded;
                return (!!isEmploeeServicesLoaded && isAllStoresLoaded);
            }),
            first(),
            mergeMap(() => {
                return of(true);
            })
        );
    }
}
