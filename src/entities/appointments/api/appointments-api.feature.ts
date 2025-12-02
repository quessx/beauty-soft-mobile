import { HttpErrorResponse } from '@angular/common/http';
import { inject } from "@angular/core";
import { ApiAppointmentsGetCollection200Response, AppointmentCreateAppointmentEmployeeAwarePublicRequestJsonld, AppointmentCreateAppointmentPublicRequestJsonld, AppointmentCreateAppointmentServicesEmployeeAwarePublicRequestJsonld, AppointmentJsonldAppointmentRead, AppointmentJsonldAppointmentWriteFromToTimeWrite, AppointmentService } from "@api/index";
import { DefaultOverlayService } from "@lib/services/default-overlay";
import { Helper } from "@lib/helpers/Helper.functions";
import { LanguageService } from '@i18n/language.service';
import { tapResponse } from "@ngrx/operators";
import { patchState, signalStoreFeature, withMethods } from "@ngrx/signals";
import { addEntity, removeEntity, setEntities, setEntity, updateEntity } from "@ngrx/signals/entities";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { SuccessInformationPopupService } from '@ui/popups/success-information-popup/success-information-popup.service';
import { TViolations } from '@ui/popups/success-information-popup/violations.types';
import { catchError, exhaustMap, filter, finalize, map, Observable, pipe, take, throwError } from "rxjs";
import { AppointmentsCollectionFilter } from "./appointments-collection.store.filter.class";
import { AppointmentEntity } from '../model/AppointmentEntity.model';

export function withAppointmentsApi() {
    return signalStoreFeature(
        withMethods((
            store: any,
            apiService: AppointmentService = inject(AppointmentService),
            defaultOverlayService: DefaultOverlayService = inject(DefaultOverlayService),
            successInformationPopupService: SuccessInformationPopupService = inject(SuccessInformationPopupService)

        ) => {
            let methods = {
                loadByClientId: rxMethod<string>(
                    pipe(
                        filter((clientId: string) => !!clientId),
                        exhaustMap((clientId: string) => {
                            defaultOverlayService.show();
                            return apiService.apiClientsClientIdappointmentsGetCollection(clientId, ...store.filter().getFilter()).pipe(
                                tapResponse({
                                    next: (appointments: ApiAppointmentsGetCollection200Response) => {
                                        const data: AppointmentJsonldAppointmentRead[] = Helper.transformAppointmentsFixedAmount(appointments.member).map(it => new AppointmentEntity(it));
                                        patchState(store, {totalItems: appointments.totalItems});
                                        patchState(store, setEntities<AppointmentEntity>(data));
                                        patchState(store, {isLoading: true});
                                    },
                                    error: console.error,
                                    finalize: () => {
                                        defaultOverlayService.hide();
                                    },
                                })
                            );
                        })
                    )
                ),
                deleteById: rxMethod<string>(
                    pipe(
                        filter((appointmentId: string) => !!appointmentId),
                        exhaustMap((appointmentId: string) => {
                            return apiService.apiAppointmentsIdDelete(appointmentId).pipe(
                                tapResponse({
                                    next: () => {
                                        patchState(store, removeEntity(appointmentId));
                                        patchState(store, {isLoading: true, isDeleted: true});
                                        successInformationPopupService.show(null, true, 5000, LanguageService.translate(`appointment_page_front.success.deleted`));
                                    },
                                    error: (error: HttpErrorResponse) => {
                                        console.error(error.message);
                                        const _data = error.error.violations as TViolations;
                                        successInformationPopupService.show(_data, false, 5000, LanguageService.translate(`appointment_page_front.errors.deleted`));
                                    },
                                    finalize: () => defaultOverlayService.hide(),
                                }),
                            );
                        })
                    )
                ),
                create: (data: AppointmentJsonldAppointmentWriteFromToTimeWrite, xAppointmentItems?: '1', xPayment?: '1', xDiscount?: '1', xScheduleDay?: '1') => {
                    return apiService.apiAppointmentsPost(data, xAppointmentItems, xPayment, xDiscount, xScheduleDay).pipe(
                        map((appointment: AppointmentJsonldAppointmentRead) => {
                            const data: AppointmentJsonldAppointmentRead = new AppointmentEntity(Helper.transformAppointmentsFixedAmount([appointment])[0]);
                            patchState(store, addEntity<AppointmentEntity>(data));
                            return data;
                        }),
                        catchError(error => {
                            console.error(error);
                            return throwError(() => error);
                        }),
                        finalize(() => defaultOverlayService.hide()),
                    );
                },
                update: (id: string, data: AppointmentJsonldAppointmentWriteFromToTimeWrite) => {
                    return apiService.apiAppointmentsIdPatch(id, data).pipe(
                        map((_appointment: AppointmentJsonldAppointmentRead) => {
                            console.log(`Upd appointment. appointmentId: ${id}, clientData:`,_appointment.client, data.client)
                            const appointment: AppointmentJsonldAppointmentRead = Helper.transformAppointmentsFixedAmount([_appointment])[0];
                            patchState(store, updateEntity<AppointmentEntity>({id: _appointment.id, changes: {...data, ...appointment}}));
                            return appointment;
                        }),
                        catchError(error => {
                            console.error(error);
                            return throwError(() => error);
                        }),
                        finalize(() => defaultOverlayService.hide()),
                    );
                },
                loadByFilter: (filter: AppointmentsCollectionFilter) => {
                    return apiService.apiAppointmentsGetCollection(...filter.getFilter()).pipe(
                        map((appointments: ApiAppointmentsGetCollection200Response) => {
                            const data: AppointmentJsonldAppointmentRead[] = Helper.transformAppointmentsFixedAmount(appointments.member).map(it => new AppointmentEntity(it));
                            patchState(store, setEntities<AppointmentEntity>(data));
                            appointments.member = data;
                            return appointments;
                        }),
                        catchError(error => {
                            console.error(error);
                            return throwError(() => error);
                        }),
                        finalize(() => defaultOverlayService.hide()),
                    );
                },
                loadById: (id: string, xAppointmentItems?: string, xPayment?: string, xDiscounts?: string, xScheduleDay?: string) => {
                    return apiService.apiAppointmentsIdGet(id, xAppointmentItems, xPayment, xDiscounts, xScheduleDay).pipe(
                        map((appointment: AppointmentJsonldAppointmentRead) => {
                            const data: AppointmentJsonldAppointmentRead = Helper.transformAppointmentsFixedAmount([appointment])[0]

                            const existingAppointment = store.entityMap()?.[id];
                            if (existingAppointment) {
                                patchState(store, updateEntity<AppointmentEntity>({id, changes: {...existingAppointment, ...data}}));
                            } else {
                                patchState(store, addEntity<AppointmentEntity>(new AppointmentEntity(data)));
                            }
                            return store.entityMap()[id];
                        }),
                        catchError(error => {
                            console.error(error);
                            return throwError(() => error);
                        }),
                        finalize(() => defaultOverlayService.hide()),
                    );
                },
                publicCreate: (createData: AppointmentCreateAppointmentPublicRequestJsonld): Observable<AppointmentJsonldAppointmentRead> => {
                    return apiService.apiPublicappointmentsPost(createData).pipe(
                        map((appointment: AppointmentJsonldAppointmentRead) => {
                            const data: AppointmentJsonldAppointmentRead = Helper.transformAppointmentsFixedAmount([appointment])[0];
                            patchState(store, setEntity<AppointmentEntity>(new AppointmentEntity(data)));
                            return data;
                        }),
                        catchError(error => {
                            console.error(error);
                            return throwError(() => error);
                        }),
                        finalize(() => defaultOverlayService.hide()),
                    );
                },
                publicCreateWithEmployee: (createData: AppointmentCreateAppointmentEmployeeAwarePublicRequestJsonld): Observable<AppointmentJsonldAppointmentRead> => {
                    return apiService.apiPublicappointmentsemployeeAwarePost(createData).pipe(
                        map((appointment: AppointmentJsonldAppointmentRead) => {
                            const data: AppointmentJsonldAppointmentRead = Helper.transformAppointmentsFixedAmount([appointment])[0];
                            patchState(store, setEntity<AppointmentEntity>(new AppointmentEntity(data)));
                            return data;
                        }),
                        catchError(error => {
                            console.error(error);
                            return throwError(() => error);
                        }),
                        finalize(() => defaultOverlayService.hide()),
                    );
                },
                publicCreateWithServiceEmployee: (createData: AppointmentCreateAppointmentServicesEmployeeAwarePublicRequestJsonld): Observable<AppointmentJsonldAppointmentRead> => {
                    return apiService.apiPublicappointmentsservicesemployeeAwarePost(createData).pipe(
                        map((appointment: AppointmentJsonldAppointmentRead) => {
                            const data: AppointmentJsonldAppointmentRead = Helper.transformAppointmentsFixedAmount([appointment])[0];
                            patchState(store, setEntity<AppointmentEntity>(new AppointmentEntity(data)));
                            return data;
                        }),
                        catchError(error => {
                            console.error(error);
                            return throwError(() => error);
                        }),
                        finalize(() => defaultOverlayService.hide()),
                    );
                },
            };
            return methods;
        })
    )
};
