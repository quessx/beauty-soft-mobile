import { AppointmentDiscountJsonldAppointmentRead, AppointmentItemJsonldAppointmentRead, AppointmentJsonldAppointmentRead, AppointmentPaymentJsonldAppointmentRead, ClientJsonldAppointmentRead, MoneyJsonldAppointmentRead, WorkScheduleDayJsonldAppointmentRead } from "@api/index";
import { TTotalWithLoyalty } from "../types/appointments.store.types";

export class AppointmentEntity implements AppointmentJsonldAppointmentRead {
    id: string;
    '@id'?: string | undefined;
    '@type'?: string;
    appointmentDiscounts?: AppointmentDiscountJsonldAppointmentRead[] | undefined;
    appointmentTotal?: MoneyJsonldAppointmentRead | undefined;
    client: ClientJsonldAppointmentRead;
    createdByRole?: AppointmentJsonldAppointmentRead.CreatedByRoleEnum | undefined;
    fromDateTime?: string | undefined;
    fromTime: string;
    items?: AppointmentItemJsonldAppointmentRead[] | undefined;
    note?: string | null | undefined;
    paid?: boolean | undefined;
    paidAmount?: MoneyJsonldAppointmentRead | undefined;
    payment?: AppointmentPaymentJsonldAppointmentRead | null | undefined;
    scheduleDay: WorkScheduleDayJsonldAppointmentRead & {
        employee?: {
            avatar?: {
                contentUrl?: string;
            };
        };
    };
    state?: AppointmentJsonldAppointmentRead.StateEnum | undefined;
    toTime: string;
    total?: MoneyJsonldAppointmentRead | undefined;
    totalWithLoyalty?: TTotalWithLoyalty;
    usedLoyaltyPoints?: MoneyJsonldAppointmentRead | undefined;

    constructor(data: AppointmentJsonldAppointmentRead) {
        Object.assign(this, data);
        this.id = data.id;
        this["@id"] = data["@id"];
        this["@type"] = data['@type'];
        this.appointmentDiscounts = data.appointmentDiscounts;
        this.appointmentTotal = data.appointmentTotal;
        this.client = data.client;
        this.createdByRole = data.createdByRole;
        this.fromDateTime = data.fromDateTime;
        this.fromTime = data.fromTime;
        this.items = data.items;
        this.note = data.note;
        this.paid = data.paid;
        this.paidAmount = data.paidAmount;
        this.payment = data.payment;
        this.scheduleDay = data.scheduleDay;
        this.state = data.state;
        this.toTime = data.toTime;
        this.total = data.total;
        this.totalWithLoyalty = data.totalWithLoyalty;
        this.usedLoyaltyPoints = data.usedLoyaltyPoints;

    }
}