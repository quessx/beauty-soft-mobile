import { ClientClientWrite, ClientJsonldClientRead } from "@api/index";
import { ClientsStore } from "../clients.store";

export interface IClientsStore extends InstanceType<typeof ClientsStore> { }

export type TFilterClients = {
    page?: string,
    itemsPerPage?: string,
    id?: string,
    id2?: string[],
    orderName?: "asc" | "desc",
    orderDiscount?: "asc" | "desc",
    orderSoldAmountAmount?: "asc" | "desc",
    existsAppointments?: boolean,
    q?: string,
    gender?: 'MALE' | 'FEMALE' | 'UNKNOWN',
    phone?: string,
    email?: string,
    appointmentDayBefore?: string,
    appointmentDayStrictlyBefore?: string,
    appointmentDayAfter?: string,
    appointmentDayStrictlyAfter?: string,
    totalSoldBetween?: string,
    totalSoldGt?: string,
    totalSoldGte?: string,
    totalSoldLt?: string,
    totalSoldLte?: string,
    appointmentEmployee?: string,
    appointmentEmployee2?: Array<string>,
    appointmentState?: "waiting" | "arrived" | "not_arrived" | "confirmed" | "cancelled",
    appointmentState2?: Array<"waiting" | "arrived" | "not_arrived" | "confirmed" | "cancelled">,
    appointmentService?: string,
    appointmentService2?: Array<string>,
    birthDayBetween?: string,
    birthDayGt?: string,
    birthDayGte?: string,
    birthDayLt?: string,
    birthDayLte?: string,
    birthDateBefore?: string,
    birthDateStrictlyBefore?: string,
    birthDateAfter?: string,
    birthDateStrictlyAfter?: string,
    xClientLastAppointment?: string,
    xAppointmentsCount?: string,
    xTotalSold?: string,
    [key: string]: any;
};

export type TFilterClientId = {
    xClientLastAppointment?: string,
    xAppointmentsCount?: string,
    xTotalSold?: string;
};

export type TClientUpdateData = {
    id: string,
    client: ClientClientWrite;
};

export type TSetFilter = {
    name: keyof TFilterClients,
    values: Array<any>;
};