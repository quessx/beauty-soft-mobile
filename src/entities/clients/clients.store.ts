import { computed } from '@angular/core';
import { SelectOption } from '@lib/types/SelectOption.class';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { withEntities } from "@ngrx/signals/entities";
import { ButtonListPopupModel } from '@ui/popups/button-list-popup/button-list-popup.model';
import { withClientsApi } from './api/clients-api.feature';
import { ClientFilter } from './api/clients.store.filter.class';
import { ClientEntity } from './model/ClientEntity.model';
import { TSetFilter } from './types/clients.store.types';
import { ClientsTableItem } from './types/table';
import { PositionsTableItem } from '@entities/speciality';

type TClientsState = {
    clients: ClientEntity[];
    isLoading: boolean,
    filter: ClientFilter,
    totalCount: number,
    selectedId: string
};

const initialState: TClientsState = {
    clients: [],
    isLoading: false,
    filter: new ClientFilter(),
    totalCount: 0,
    selectedId: '',
};

export const ClientsStore = signalStore(
    { providedIn: "root", protectedState: false },
    withState(initialState),
    withEntities<ClientEntity>(),
    withClientsApi(),
    withComputed((store) => ({
        getTableData: computed(() => {
            return store.entities().map((client: ClientEntity) => {
                return new ClientsTableItem({
                    id: client.id,
                    orderName: client.fullName || client.name,
                    phone:  client?.phone || '',
                    email: client.email || '',
                    orderSoldAmountAmount: client.totalSold?.amount || '0',
                    visits: client.appointmentsCount?.toString() || '0',
                    orderDiscount: client.discount ? client.discount.toString() : '0',
                    last_visit: client.lastAppointment?.scheduleDay?.day || client.lastVisit || ''
                });
            })
        }),
        getPositionsTableItems: computed(() => {
            return store.entities().map((client: ClientEntity) => {
                return new PositionsTableItem({
                    id: client['@id'],
                    orderName: client.fullName || client.name,
                    description:  client?.phone || '',
                });
            })
        }),
        getSelectedClient: computed(() => {
            return store.entityMap()[store.selectedId()];
        }),
        getAsButtonListPopupModel: computed(() => {
            return new ButtonListPopupModel(
                store.entities().map((client: ClientEntity) => {
                    return new SelectOption<string, any>({
                        id: client.id,
                        value: client.id,
                        label: client.name,
                    });
                })
            );
        }),
        hasActiveFilters: computed(() => {
            const ignoredFields: Set<string> = new Set<string>(['page', 'itemsPerPage', 'xAppointmentsCount', 'xClientLastAppointment', 'xTotalSold']);

            return Object.entries(store.filter().filters).some(
                ([key, value]: [string, any]): boolean =>
                    !ignoredFields.has(key) &&
                    value !== undefined &&
                    value !== null &&
                    value !== ''
            );
        })
    })),
    withMethods((store: any) => ({
        setFilter: (filter: TSetFilter[]) => {
            let filters: ClientFilter = new ClientFilter();
            filter.forEach((params: TSetFilter) => {
                if (['id2','appointmentState2','appointmentEmployee2','appointmentService2'].includes(params.name.toString())) {
                    filters.setFilterByName(params.name, params.values);
                } else {
                    filters.setFilterByName(params.name, params.values.pop());
                }
            });
            patchState(store, { filter: filters });
        },
        clearFilter: () => {
            patchState(store, { filter: new ClientFilter({
                    page: store.filter().filters.page,
                    itemsPerPage: store.filter().filters.itemsPerPage,
            }) });
        }
    }))
)
