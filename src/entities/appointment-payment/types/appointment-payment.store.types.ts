import { AppointmentPaymentStore } from "../appointment-payment.store";

export interface IAppointmentPaymentStore extends InstanceType<typeof AppointmentPaymentStore> {}

export type TAppointmentDiscountWithId =  {
    id: string;
    appointmentId: string;
};
