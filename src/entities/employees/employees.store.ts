import { computed, inject } from '@angular/core';
import { ISpecialityStore, PositionsTableItem, SpecialityStore } from '@entities/speciality';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { withEntities } from "@ngrx/signals/entities";
import { withEmployeesApi } from './api/employees-api.feature';
import { EmployeesFilter } from './api/employees.store.filter.class';
import { TSetFilter } from './types/employees.store.types';
import { EmployeeEntity } from './model/EmployeeEntity.model';;
import { EmployeeCardModel, EmployeeJsonldEmployeeReadIdRead } from './index';
import { SelectOption } from '@lib/types/SelectOption.class';
import { FIRED_STATE_VALUE } from '@lib/const';
import { ClientEntity } from '@entities/clients';

type TEmployeesState = {
    employees: EmployeeEntity[];
    employeesWithFilter: EmployeeEntity[];
    createdOrganizations: EmployeeJsonldEmployeeReadIdRead[];
    isLoading: boolean;
    isSearching: boolean,
    filter: EmployeesFilter;
    selectedId: string;
    totalEmployees: number;
};

const initialState: TEmployeesState = {
    employees: [],
    employeesWithFilter: [],
    createdOrganizations: [],
    isLoading: false,
    isSearching: false,
    filter: new EmployeesFilter(),
    selectedId: '',
    totalEmployees: 0
};

export const EmployeesStore = signalStore(
    { providedIn: "root", protectedState: false },
    withState(initialState),
    withEntities<EmployeeEntity>(),
    withEmployeesApi(),
    withComputed((store, specialityStore: ISpecialityStore = inject(SpecialityStore)) => ({
        getAsEmployeeCardModelWithFilter: computed(() => {
            const entities: EmployeeEntity[] = store.filter().filters.q ? store.employeesWithFilter() : store.entities();
            return EmployeeEntity.getEmployeesModel(entities, specialityStore);
        }),
        getAsEmployeeCardModel: computed(() => {
            return EmployeeEntity.getEmployeesModel(store.entities(), specialityStore);
        }),
        getAsEmployeeCardModelById: computed((): EmployeeCardModel => {
            let employee: EmployeeEntity = store.entityMap()[store.selectedId()];
            if (!employee) {
                return new EmployeeCardModel(employee);
            }
            return EmployeeEntity.getEmployeeModel(employee, specialityStore);
        }),
        getEmployeesAsSelectOptions: computed(() => {
            return store.entities().map((it) => {
                return new SelectOption({
                    id: it.id, label: it.name + ' ' + (it.lastName ?? ''), value: it.id, metadata: { avatar: it.avatar?.contentUrl }
                });
            });
        }),
        getSelectedEmployee: computed(() => {
            return store.entityMap()[store.selectedId()];
        }),
        getPositionsTableItems: computed(() => {
            return store.entities().map((employee: EmployeeEntity) => {
                return new PositionsTableItem({
                    id: employee.id,
                    orderName: employee.name + ' ' + (employee?.middleName || '') + ' ' + (employee?.lastName || ''),
                    description: '',
                    icon: employee?.avatar?.contentUrl ?? 'default'
                });
            })
        }),
        isSelectedEmployeeFired: computed<boolean>(() => {
            return store.entityMap()[store.selectedId()]?.state === FIRED_STATE_VALUE;
        }),
        hasActiveFilters: computed(() => {
            const ignoredFields = new Set(['page', 'itemsPerPage', 'xLastScheduledDay', 'xAvatar']);

            return Object.entries(store.filter().filters).some(
                ([key, value]) =>
                    !ignoredFields.has(key) &&
                    value !== undefined &&
                    value !== null &&
                    value !== ''
            );
        })
    })),
    withMethods((store: any) => ({
        setFilter: (filter: TSetFilter[]) => {
            let filters: EmployeesFilter = new EmployeesFilter();
            filter.forEach((params: TSetFilter) => {
                let _params: any;
                if (params.name == "specialities2") {
                    _params = params.values;
                } else {
                    _params = params.values.length === 1 ? params.values.pop() : params.values;
                }
                filters.setFilterByName(params.name as string, _params);
            });
            patchState(store, { filter: filters });
            store.loadByFilter();
        },
        getEmployeeById: (id: string | undefined): EmployeeEntity => {
            if (!id) {
                throw new Error('employee id is null');
            }
            return store.entityMap()[id];
        }
    }))
);
