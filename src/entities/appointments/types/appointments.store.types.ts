import {
    AppliedCashbackInterfaceJsonldAppointmentRead,
    AppliedDiscountInterfaceJsonldAppointmentRead,
    AppointmentAppointmentRead,
    AppointmentItemJsonldAppointmentRead,
    AppointmentJsonldAppointmentRead,
    DiscountJsonldDiscountRead,
    DocumentLoyaltyCalculatorJsonldAppointmentRead,
    Money,
    MoneyJsonld
} from "@api/index";
import { AppointmentsStore } from "../appointments.store";


export interface IAppointmentsStore extends InstanceType<typeof AppointmentsStore> {}

export type TFilterAppointments = {
    page?: number,
    itemsPerPage?: number,
    pagination?: boolean,
    xAppointmentItems?: string,
    xPayment?: string,
    xDiscounts?: string,
    xScheduleDay?: string,
    [key: string]: any;
}

export type TFilterAppointmentsCollection = {
    page?: number,
    itemsPerPage?: number,
    fromTimeBefore?: string,
    fromTimeStrictlyBefore?: string,
    fromTimeAfter?: string,
    fromTimeStrictlyAfter?: string,
    dayBefore?: string,
    dayStrictlyBefore?: string,
    dayAfter?: string,
    dayStrictlyAfter?: string,
    state?: AppointmentAppointmentRead.StateEnum,
    employee?: string,
    employee2?: Array<string>,
    client?: string,
    client2?: Array<string>,
    cancelled?: boolean,
    xAppointmentItems?: string,
    xPayment?: string,
    xDiscounts?: string,
    xScheduleDay?: string,
    [key: string]: any;
}

export type TAppointmentItems = AppointmentItemJsonldAppointmentRead & {
    price?: MoneyJsonld;
    employeeService?: {
        service?: {
            name?: string;
        }
    }
};

export type TApliedAppointmentDiscount = AppliedDiscountInterfaceJsonldAppointmentRead & {
    before?: Money
    after?: Money
    discountValue?: Money
}

export type TApliedAppointmentCashback = AppliedCashbackInterfaceJsonldAppointmentRead & {
    cashbackValue?: Money
}

export type TAppliedDiscount =  AppliedDiscountInterfaceJsonldAppointmentRead & { discount?: DiscountJsonldDiscountRead };

export type TTotalWithLoyalty = DocumentLoyaltyCalculatorJsonldAppointmentRead & { appliedDiscounts?: TAppliedDiscount[] } | undefined;