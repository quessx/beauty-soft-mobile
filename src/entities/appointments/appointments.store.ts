import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { withEntities } from "@ngrx/signals/entities";
import { withAppointmentsApi } from './api/appointments-api.feature';
import { AppointmentJsonldAppointmentRead } from '@api/index';
import { computed, inject } from '@angular/core';
import { AppointmentsFilter } from './api/appointments.store.filter.class';
import moment from 'moment';
import { ClientsStore, IClientsStore } from '@entities/clients';
import { AppointmentEntity } from './model/AppointmentEntity.model';

type TAppointmentsState = {
    appointments: AppointmentJsonldAppointmentRead[];
    filter: AppointmentsFilter,
    isLoading: boolean,
    isDeleted: boolean,
    totalItems: number,
    selectedId: string,
};

const initialState: TAppointmentsState = {
    appointments: [],
    filter: new AppointmentsFilter(),
    isLoading: false,
    isDeleted: false,
    totalItems: 0,
    selectedId: ''
};

export const AppointmentsStore = signalStore(
    { providedIn: "root", protectedState: false },
    withState(initialState),
    withEntities<AppointmentEntity>(),
    withAppointmentsApi(),
    withComputed((store, clientStore: IClientsStore = inject(ClientsStore)) => ({
        getEntitiesWithSelectedClient: computed(() => {
            const selectedClientId: string = clientStore.selectedId();
            return store.entities()
                .filter((appointment: AppointmentEntity) => appointment.client?.id === selectedClientId)
                .sort((a: AppointmentEntity, b: AppointmentEntity) => {
                if(!a.fromDateTime || !b.fromDateTime) {
                    return 0;
                }
                return new Date(b.fromDateTime).getTime() - new Date(a.fromDateTime).getTime();
            });
        }),
        getSelectedAppointment: computed(() => {
            return store.entityMap()[store.selectedId()];
        })
    })),
    withMethods((store) => ({
        getLoadMoreEntities: (clientId: string) => {
            let appointmentsFilter: AppointmentsFilter = new AppointmentsFilter();
            let itemsPerPage: number | undefined = store.filter().filters.itemsPerPage;
            if (itemsPerPage && clientId) {
                appointmentsFilter.setFilterByName('itemsPerPage', itemsPerPage + 10);
                appointmentsFilter.setFilterByName('xAppointmentItems', '1');
                appointmentsFilter.setFilterByName('xScheduleDay', '1');
                appointmentsFilter.setFilterByName('xPayment', '1');
                appointmentsFilter.setFilterByName('xDiscounts', '1');
                patchState(store, { isLoading: false, filter: appointmentsFilter });
                store.loadByClientId(clientId);
            }
        },
        getLastVisitedAppointments: (clientId: string) => {
            let appointment = store.entityMap()[clientId];
            if (!appointment) {
                store.loadByClientId(clientId);
                return null;
            }
            return appointment;
        },
        getCollectionBySheduleDayByTimePeriod: (sheduleId: string, from: Date, to: Date): AppointmentJsonldAppointmentRead[] => {
            return store.entities()
                    .filter((appointment: AppointmentJsonldAppointmentRead) => appointment.scheduleDay.id === sheduleId)
                    .filter((appointment: AppointmentJsonldAppointmentRead) => {
                        if (!appointment.fromTime || !appointment.toTime) {
                            return false;
                        }
                        const fromMoment = moment(from);
                        const toMoment = moment(to);
                        const appointmentFromMoment = moment(appointment.fromTime, 'HH:mm:ss');
                        const appointmentToMoment = moment(appointment.toTime, 'HH:mm:ss');

                        return appointmentFromMoment.isSameOrAfter(fromMoment) && appointmentToMoment.isSameOrBefore(toMoment);
                    });
        },
    }))
)
