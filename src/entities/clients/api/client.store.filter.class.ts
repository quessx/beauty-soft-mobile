import { TFilterClientId } from "../types/clients.store.types";

export class ClientIdFilter {
    readonly filters: TFilterClientId = {
        xAppointmentsCount: '1',
        xClientLastAppointment: '1',
        xTotalSold: '1'
    };

    constructor(filters?: TFilterClientId) {
        if (filters) {
            Object.assign(this.filters, filters);
        }
    }

    setFilterByName(name: keyof TFilterClientId, value: any): this {
        if (name in this.filters && typeof name === 'string') {
            this.filters[name] = value;
        } else {
            throw new Error(`Invalid filter name: ${name}`);
        }
        return this;
    }

    getFilter(): any[] {
        return [
            this.filters.xClientLastAppointment,
            this.filters.xAppointmentsCount,
            this.filters.xTotalSold
        ];
    }
}