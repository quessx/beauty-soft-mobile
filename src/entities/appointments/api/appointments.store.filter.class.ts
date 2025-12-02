import { TFilterAppointments } from "../types/appointments.store.types";

export class AppointmentsFilter {
    readonly filters: TFilterAppointments = {
        page: 1,
        itemsPerPage: 10,
        pagination: undefined,
        xAppointmentItems: undefined,
        xPayment: undefined,
        xDiscounts: undefined,
        xScheduleDay: undefined,
    }

    setFilterByName(name: string, value: any): this {
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
            this.filters.pagination,  // added pagination to filter list for better compatibility with existing code.
            this.filters.xAppointmentItems,
            this.filters.xPayment,
            this.filters.xDiscounts,
            this.filters.xScheduleDay,
        ]
    }
}
