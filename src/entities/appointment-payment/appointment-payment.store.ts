import { signalStore, withComputed, withState } from '@ngrx/signals';
import { withEntities } from "@ngrx/signals/entities";
import { withAppointmentPaymentApi } from './api/appointment-payment-api.feature';
import { AppointmentPaymentEntity } from './model/AppointmentPaymentEntity.model';

type TAppointmentPaymentState = {
    appointmentPayments: AppointmentPaymentEntity[];
    selectedId: string
};
 
const initialState: TAppointmentPaymentState = {
    appointmentPayments: [],
    selectedId: '',
};

export const AppointmentPaymentStore = signalStore(
    { providedIn: "root", protectedState: false },
    withState(initialState),
    withEntities<AppointmentPaymentEntity>(),
    withAppointmentPaymentApi(),
    withComputed((store) => ({
    })),
)
