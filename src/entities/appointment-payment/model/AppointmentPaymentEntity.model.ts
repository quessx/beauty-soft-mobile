import { AppointmentJsonldAppointmentPaymentReadIdReadPaymentRead, AppointmentPaymentJsonldAppointmentPaymentReadIdReadPaymentRead, PaymentMethodJsonldAppointmentPaymentReadIdReadPaymentRead } from "@api/index";
import { Helper } from "@lib/helpers/Helper.functions";

export class AppointmentPaymentEntity implements AppointmentPaymentJsonldAppointmentPaymentReadIdReadPaymentRead {
    id: string;
    '@id'?: string | undefined;
    '@type'?: string;
    appointment: AppointmentJsonldAppointmentPaymentReadIdReadPaymentRead | null;
    paid?: boolean | undefined;
    paidAt?: string | null | undefined;
    paymentMethod: PaymentMethodJsonldAppointmentPaymentReadIdReadPaymentRead;
    state?: string | undefined;
    useLoyaltyPoints?: boolean | undefined;

    constructor(data: AppointmentPaymentJsonldAppointmentPaymentReadIdReadPaymentRead) {
        Object.assign(this, data);
        this.id = data.id;
        this["@id"] = data["@id"];
        this["@type"] = data['@type'];
        this.appointment = data.appointment;
        this.paid = data.paid;
        this.paidAt = data.paidAt;
        this.paymentMethod = data.paymentMethod;
        this.state = data.state;
        this.useLoyaltyPoints = data.useLoyaltyPoints;
    }
}