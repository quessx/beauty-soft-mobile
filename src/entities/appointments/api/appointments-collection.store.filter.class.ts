import { TFilterAppointmentsCollection } from "../types/appointments.store.types";

export class AppointmentsCollectionFilter {
    readonly filters: TFilterAppointmentsCollection = {
        page: undefined,
        itemsPerPage: undefined,
        fromTimeBefore: undefined,
        fromTimeStrictlyBefore: undefined,
        fromTimeAfter: undefined,
        fromTimeStrictlyAfter: undefined,
        dayBefore: undefined,
        dayStrictlyBefore: undefined,
        dayAfter: undefined,
        dayStrictlyAfter: undefined,
        state: undefined,
        employee: undefined,
        employee2: undefined,
        client: undefined,
        client2: undefined,
        cancelled: undefined,
        xAppointmentItems: undefined,
        xPayment: undefined,
        xDiscounts: undefined,
        xScheduleDay: undefined,
    };

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
            this.filters.fromTimeBefore,
            this.filters.fromTimeStrictlyBefore,
            this.filters.fromTimeAfter,
            this.filters.fromTimeStrictlyAfter,
            this.filters.dayBefore,
            this.filters.dayStrictlyBefore,
            this.filters.dayAfter,
            this.filters.dayStrictlyAfter,
            this.filters.state,
            this.filters.client,
            this.filters.client2,
            this.filters.cancelled,
            this.filters.employee,
            this.filters.employee2,
            this.filters.xAppointmentItems,
            this.filters.xPayment,
            this.filters.xDiscounts,
            this.filters.xScheduleDay
        ];
    }
}