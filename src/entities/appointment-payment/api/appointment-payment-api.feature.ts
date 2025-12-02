import { inject } from "@angular/core";
import { AppointmentPaymentJsonldAppointmentPaymentReadIdReadPaymentRead, AppointmentPaymentJsonldAppointmentPaymentWritePaymentWrite, AppointmentPaymentService } from "@api/index";
import { DefaultOverlayService } from "@lib/services/default-overlay";
import { signalStoreFeature, withMethods } from "@ngrx/signals";
import { catchError, finalize, map, throwError } from "rxjs";

export function withAppointmentPaymentApi() {
    return signalStoreFeature(
        withMethods((
            store: any,
            apiService: AppointmentPaymentService = inject(AppointmentPaymentService),
            defaultOverlayService: DefaultOverlayService = inject(DefaultOverlayService),
        ) => {
            let methods = {
                create: (createData: AppointmentPaymentJsonldAppointmentPaymentWritePaymentWrite) => {
                    return apiService.apiAppointmentPaymentspayPost(createData).pipe(
                        map((appointmentDiscount: AppointmentPaymentJsonldAppointmentPaymentReadIdReadPaymentRead) => {
                            return appointmentDiscount;
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
