import { TFilterClients } from "../types/clients.store.types";

export class ClientFilter {
    readonly filters: TFilterClients = {
        page: "1",
        itemsPerPage: "10",
        id: undefined,
        id2: undefined,
        orderName: undefined,
        orderDiscount: undefined,
        orderSoldAmountAmount: undefined,
        existsAppointments: undefined,
        q: undefined,
        gender: undefined,
        phone: undefined,
        email: undefined,
        appointmentDayBefore: undefined,
        appointmentDayStrictlyBefore: undefined,
        appointmentDayAfter: undefined,
        appointmentDayStrictlyAfter: undefined,
        totalSoldBetween: undefined,
        totalSoldGt: undefined,
        totalSoldGte: undefined,
        totalSoldLt: undefined,
        totalSoldLte: undefined,
        appointmentEmployee: undefined,
        appointmentEmployee2: undefined,
        appointmentState: undefined,
        appointmentState2: undefined,
        appointmentService: undefined,
        appointmentService2: undefined,
        birthDayBetween: undefined,
        birthDayGt: undefined,
        birthDayGte: undefined,
        birthDayLt: undefined,
        birthDayLte: undefined,
        birthDateBefore: undefined,
        birthDateStrictlyBefore: undefined,
        birthDateAfter: undefined,
        birthDateStrictlyAfter: undefined,
        xClientLastAppointment: '1',
        xAppointmentsCount: '1',
        xTotalSold: undefined,
    };

    constructor(filters?: TFilterClients) {
        if (filters) {
            Object.assign(this.filters, filters);
        }
    }

    setFilterByName(name: keyof TFilterClients, value: any): this {
        if (name in this.filters && typeof name === 'string') {
            this.filters[name] = value;
        } else {
            throw new Error(`Invalid filter name: ${name}`);
        }
        return this;
    }

    getFilter(): any[] {
        return [
            this.filters.page,
            this.filters.itemsPerPage,
            this.filters.id,
            this.filters.id2,
            this.filters.orderName,
            this.filters.orderDiscount,
            this.filters.orderSoldAmountAmount,
            this.filters.existsAppointments,
            this.filters.q,
            this.filters.gender,
            this.filters.phone,
            this.filters.email,
            this.filters.appointmentDayBefore,
            this.filters.appointmentDayStrictlyBefore,
            this.filters.appointmentDayAfter,
            this.filters.appointmentDayStrictlyAfter,
            this.filters.totalSoldBetween,
            this.filters.totalSoldGt,
            this.filters.totalSoldGte,
            this.filters.totalSoldLt,
            this.filters.totalSoldLte,
            this.filters.appointmentEmployee,
            this.filters.appointmentEmployee2,
            this.filters.appointmentState,
            this.filters.appointmentState2,
            this.filters.appointmentService,
            this.filters.appointmentService2,
            this.filters.birthDayBetween,
            this.filters.birthDayGt,
            this.filters.birthDayGte,
            this.filters.birthDayLt,
            this.filters.birthDayLte,
            this.filters.birthDateBefore,
            this.filters.birthDateStrictlyBefore,
            this.filters.birthDateAfter,
            this.filters.birthDateStrictlyAfter,
            this.filters.xClientLastAppointment,
            this.filters.xAppointmentsCount,
            this.filters.xTotalSold
        ];
    }
}
