import { HttpErrorResponse } from '@angular/common/http';
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { LanguageService } from '@i18n/language.service';
import { tapResponse } from "@ngrx/operators";
import { patchState, signalStoreFeature, withMethods } from "@ngrx/signals";
import { addEntity, removeEntity, setAllEntities, setEntities, updateEntity } from "@ngrx/signals/entities";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { SuccessInformationPopupService } from '@ui/popups/success-information-popup/success-information-popup.service';
import { TViolations } from "@ui/popups/success-information-popup/violations.types";
import { catchError, exhaustMap, filter, finalize, map, pipe, tap, throwError } from "rxjs";
import { TRequiredFileds } from "../types/employees.store.types";
import { TPublicEmployeesFilter } from "../types/public-employees.store.types";
import { EmployeeEntity } from '../model/EmployeeEntity.model';
import { EmployeeServiceEntity } from '@entities/employee-service';
import { ApiEmployeesGetCollection200Response, EmployeeCreateOrganizationAdministratorInputJsonld, EmployeeCreateOrganizationAdministratorOutputJsonldIdReadEmployeeReadCreateOrganizationAdministratorRead, EmployeeEmployeeWrite, EmployeeFireEmployeeDtoFireEmployeeWrite, EmployeeJsonldEmployeeReadIdRead, EmployeeJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead, EmployeeJsonldEmployeeWrite, EmployeeService, EmployeeServiceEmployeeServiceRead, SetServicesToEmployeeRequest, SpecialityJsonldEmployeeReadIdRead } from '@api/index';
import { DefaultOverlayService } from '@lib/services/default-overlay';
import { ValidationPopupsService } from '@lib/services/validation';
import { Helper } from '@lib/helpers/Helper.functions';

export function withEmployeesApi() {
    return signalStoreFeature(
        withMethods((
            store: any,
            apiService: EmployeeService = inject(EmployeeService),
            // defaultOverlayService: DefaultOverlayService = inject(DefaultOverlayService),
            successInformationPopupService: SuccessInformationPopupService = inject(SuccessInformationPopupService),
            languageService: LanguageService = inject(LanguageService),
            validationPopupsService: ValidationPopupsService = inject(ValidationPopupsService),
            router: Router = inject(Router),
        ) => {
            let methods = {
                loadByFilter: rxMethod<void>(
                    pipe(
                        exhaustMap(() => {
                            // defaultOverlayService.show();
                            return apiService.apiEmployeesGetCollection(...store.filter().getFilter()).pipe(
                                tapResponse({
                                    next: (employees: ApiEmployeesGetCollection200Response) => {
                                        if (store.filter().filters?.q?.length > 0) {
                                            patchState(store, { employeesWithFilter: employees.member });
                                        } else {
                                            patchState(store, { employeesWithFilter: [] });
                                            patchState(store, setAllEntities<EmployeeEntity>(employees.member.map(it => new EmployeeEntity(it))));
                                        }
                                        patchState(store, { isLoading: true });
                                        patchState(store, { isSearching: false });

                                        if (store.totalEmployees() <= 0) {
                                            patchState(store, { totalEmployees: employees.totalItems });
                                        }
                                    },
                                    error: console.error,
                                    finalize: () => {
                                        // defaultOverlayService.hide();
                                    },
                                })
                            );
                        })
                    )
                ),
                loadByEmployeeByFilterAsObservable: () => {
                    // defaultOverlayService.show();
                    return apiService.apiEmployeesGetCollection(...store.filter().getFilter()).pipe(
                        tapResponse({
                            next: (employees: ApiEmployeesGetCollection200Response) => {
                                patchState(store, setEntities<EmployeeEntity>(employees.member.map(it => new EmployeeEntity(it))));
                                patchState(store, { isLoading: true });
                                patchState(store, { isSearching: false });

                                if (store.totalEmployees() <= 0) {
                                    patchState(store, { totalEmployees: employees.totalItems });
                                }
                            },
                            error: console.error,
                            finalize: () => {
                                // defaultOverlayService.hide();
                            },
                        })
                    );
                },
                loadById: rxMethod<string>(
                    pipe(
                        filter((id: string) => !!id),
                        exhaustMap((id: string) => {
                            // defaultOverlayService.show();
                            return apiService.apiEmployeesIdGet(id).pipe(
                                tapResponse({
                                    next: (employee: EmployeeJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead) => {
                                        patchState(store, addEntity<EmployeeEntity>(new EmployeeEntity(employee)));
                                    },
                                    error: console.error,
                                    // finalize: () => defaultOverlayService.hide(),
                                }),
                            );
                        })
                    )
                ),
                loadByIdAsObservable: (employeeId: string) => {
                    return apiService.apiEmployeesIdGet(employeeId).pipe(
                        tap({
                            next: (employee: EmployeeJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead) => {
                                patchState(store, addEntity<EmployeeEntity>(new EmployeeEntity(employee)));
                                return employee;
                            },
                            error: error => {
                                console.error(error);
                                return throwError(() => error);
                            }
                        }),
                        // finalize(() => defaultOverlayService.hide()),
                    );
                },
                setTotalEmployees: rxMethod<void>(
                    pipe(
                        exhaustMap(() => {
                            return apiService.apiEmployeesGetCollection().pipe(
                                tapResponse({
                                    next(value: ApiEmployeesGetCollection200Response) {
                                        patchState(store, { totalEmployees: value.totalItems });
                                    },
                                    error: console.log
                                })
                            );
                        })
                    )
                ),
                createEmpoyees: rxMethod<EmployeeJsonldEmployeeWrite>(
                    pipe(
                        filter((employees: EmployeeJsonldEmployeeWrite) => {
                            if (employees.phone.length < 6) {
                                const requiredFields: TRequiredFileds[] = ['email', 'name', 'lastName'];
                                const errors: TViolations = [];
                                Object.entries(employees).forEach(([key, value]: [string, string | number | boolean | string[] | null]) => {
                                    if (requiredFields.includes(key as TRequiredFileds) && value?.toString().length == 0) {
                                        errors.push({
                                            code: '400',
                                            message: LanguageService.translate('employee_new.errors.required'),
                                            propertyPath: key
                                        });
                                    }
                                })

                                errors.push({
                                    code: '400',
                                    message: LanguageService.translate('employee_new.errors.invalid_phone'),
                                    propertyPath: 'phone'
                                });
                                validationPopupsService.setViolations(errors);
                                return false;
                            }
                            return !!employees;
                        }),
                        exhaustMap((employees: EmployeeJsonldEmployeeWrite) => {
                            // defaultOverlayService.show();
                            employees.specialities = (employees.specialities || []).map(id => `/main/specialities/${ id }`);
                            return apiService.apiEmployeesPost(employees).pipe(
                                tapResponse({
                                    next: (employees: EmployeeJsonldEmployeeReadIdRead) => {
                                        patchState(store, { totalEmployees: store.totalEmployees() + 1 });
                                        methods.loadByFilter();
                                        validationPopupsService.setViolations(undefined);
                                        router.navigate([`settings/employees/${ employees.id }/info`]);
                                    },
                                    error: (error: HttpErrorResponse) => {
                                        validationPopupsService.setViolations(error?.error?.violations);
                                        console.error(error);
                                    },
                                    // finalize: () => defaultOverlayService.hide(),
                                }),
                            );
                        })
                    )
                ),
                fireEmployee: (fireData: EmployeeFireEmployeeDtoFireEmployeeWrite) => {
                    // defaultOverlayService.show();
                    return apiService.fireEmployee(
                        store.selectedId(),
                        fireData,
                        undefined,
                        undefined
                    ).pipe(
                        tapResponse({
                            next: (employee: EmployeeJsonldEmployeeReadIdRead) => {
                                // patchState(store, updateEntity<EmployeeEntity>({ id: store.selectedId(), changes: {state: employee.state} }));
                                successInformationPopupService.hide().show(null, true, 5000, LanguageService.translate('employee_fire_widget.fire.success_information.success'));
                                patchState(store, removeEntity(employee.id));
                                router.navigate(['settings/employees']);
                                // methods.loadByFilter();
                            },
                            error: (error: HttpErrorResponse) => {
                                successInformationPopupService.hide();
                                successInformationPopupService.show(error?.error?.violations ?? null, false, 5000, (error.error.detail && !error?.error?.violations) ? error.error.detail : LanguageService.translate('employee_fire_widget.fire.success_information.error'));
                                console.error('Error firing employee:', error);
                            },
                            // finalize: () => defaultOverlayService.hide(),
                        })
                    );
                },
                updateServices: (services: SetServicesToEmployeeRequest) => {
                    // defaultOverlayService.show();
                    return apiService.setServicesToEmployee(store.selectedId(), undefined, undefined, services).pipe(
                        map((response: EmployeeServiceEmployeeServiceRead[]) => {
                            const _temp: EmployeeServiceEmployeeServiceRead[] | undefined = (response as any)?.member; // todo
                            // defaultOverlayService.hide();
                            if (!_temp) {
                                return [];
                            }
                            const employee: EmployeeEntity = store.entityMap()[store.selectedId()];
                            const modified: EmployeeServiceEntity[] = _temp.map((it: EmployeeServiceEmployeeServiceRead) => {
                                return new EmployeeServiceEntity({ ...it, employee: { ...employee, email: employee.email ?? null }, service: it.service })
                            });
                            return modified;
                        }),
                        catchError(error => {
                            console.error(error);
                            return throwError(() => error);
                        }),
                        // finalize(() => defaultOverlayService.hide()),
                    );
                },
                updateEmployee: rxMethod<{ formData: EmployeeEmployeeWrite; }>(
                    pipe(
                        exhaustMap((data) => {
                            // defaultOverlayService.show();
                            return apiService.apiEmployeesIdPatch(store.selectedId(), data.formData, '1', '1').pipe(
                                tapResponse({
                                    next: (data: EmployeeJsonldEmployeeReadIdRead) => {
                                        patchState(store, updateEntity<EmployeeEntity>({
                                            id: data.id,
                                            changes: new EmployeeEntity({
                                                ...data,
                                                lastName: data.lastName ?? null,
                                                email: data.email ?? null,
                                                specialities: Array.isArray(data.specialities)
                                                    ? data.specialities.map((spec: SpecialityJsonldEmployeeReadIdRead) => ({
                                                        ...spec,
                                                        name: (spec as any).name ?? '', // Ensure 'name' property exists
                                                    }))
                                                    : data.specialities,
                                            }),
                                        }));
                                        validationPopupsService.setViolations(undefined);
                                        // defaultOverlayService.hide();
                                    },
                                    error: (error: HttpErrorResponse) => {
                                        validationPopupsService.setViolations(error.error.violations);
                                        // defaultOverlayService.hide();
                                        successInformationPopupService.show(error.error.violations, false, 1000, languageService.translate('employee_info_widget.error.validation_error'))
                                    }
                                })
                            );
                        })
                    )
                ),
                updateEmployeePosition: rxMethod<{ id: string, employee: EmployeeEmployeeWrite; }>(
                    pipe(
                        exhaustMap((data) => {
                            return apiService.apiEmployeesIdPatch(data.id, data.employee).pipe(
                                tapResponse({
                                    error: console.log,
                                    next: (it) => {
                                        // patchState(store, updateEntity({id: it.id, changes: it}))
                                        methods.loadByFilter();
                                    }
                                })
                            );
                        })
                    )
                ),
                rehireEmployee: rxMethod<{}>(
                    pipe(
                        filter(() => !!store.selectedId()),
                        exhaustMap((rehireData) => {
                            // defaultOverlayService.show();
                            return apiService.rehireEmployee(store.selectedId(), rehireData
                            ).pipe(
                                tapResponse({
                                    next: (employee: EmployeeJsonldEmployeeReadIdRead) => {
                                        successInformationPopupService.hide().show(null, true, 5000, LanguageService.translate('employee_rehire_widget.rehire.success_information.success'));
                                        patchState(store, removeEntity(employee.id));
                                        router.navigate(['settings/employees']);
                                        // patchState(store, updateEntity<EmployeeEntity>({ id: employee.id, changes: {state: employee.state} }));
                                        // methods.loadByFilter();
                                    },
                                    error: (error: HttpErrorResponse) => {
                                        successInformationPopupService.hide();
                                        successInformationPopupService.show(null, false, 5000, LanguageService.translate('employee_rehire_widget.rehire.success_information.error'));
                                        console.error('Error rehiring employee', error);
                                    },
                                    // finalize: () => defaultOverlayService.hide(),
                                })
                            )
                        })
                    )
                ),
                publicByOrganization: rxMethod<TPublicEmployeesFilter>(
                    pipe(
                        exhaustMap((filter: TPublicEmployeesFilter) => {
                            // defaultOverlayService.show();
                            return apiService.publicOrganizationEmployees(filter.orgId, ...filter.restFilter.getFilter()).pipe(
                                tapResponse({
                                    next: (employees: ApiEmployeesGetCollection200Response) => {
                                        let data: EmployeeJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead[] = employees.member.map((member: EmployeeJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead) => {
                                            return {
                                                ...member,
                                                id: Helper.getUIDFromAtId(member['@id']),
                                            };
                                        });
                                        patchState(store, setAllEntities<EmployeeEntity>(data.map(it => new EmployeeEntity(it))));
                                        patchState(store, { isLoading: true });
                                    },
                                    error: console.error,
                                    finalize: () => {
                                        // defaultOverlayService.hide();
                                    },
                                })
                            );
                        })
                    )
                ),
                createOrganizationAdmin: rxMethod<EmployeeCreateOrganizationAdministratorInputJsonld>(
                    pipe(
                        exhaustMap((data: EmployeeCreateOrganizationAdministratorInputJsonld) => {
                            // defaultOverlayService.show();
                            return apiService.apiPublicorganizationAdminPost(data).pipe(
                                tapResponse({
                                    next: (employee: EmployeeCreateOrganizationAdministratorOutputJsonldIdReadEmployeeReadCreateOrganizationAdministratorRead) => {
                                        patchState(store, { createdOrganizations: [employee] });
                                    },
                                    error: (error: HttpErrorResponse) => {
                                        validationPopupsService.setViolations(error?.error?.violations);
                                        console.error('Error creating organization admin', error);
                                    },
                                    // finalize: () => defaultOverlayService.hide(),
                                })
                            );
                        })
                    )
                ),
                createOrganizationAdministratorAsObservable: (data: EmployeeCreateOrganizationAdministratorInputJsonld) => {
                    // defaultOverlayService.show();
                    return apiService.apiPublicorganizationAdminPost(data).pipe(
                        tapResponse({
                            next: (employee: EmployeeCreateOrganizationAdministratorOutputJsonldIdReadEmployeeReadCreateOrganizationAdministratorRead) => {
                                patchState(store, { createdOrganizations: [employee] });
                            },
                            error: (error: HttpErrorResponse) => {
                                console.error('Error creating organization admin', error);
                            },
                            // finalize: () => defaultOverlayService.hide(),
                        })
                    );
                },
            };
            return methods;
        })
    );
};
