import { TFilterPublicEmployees } from "../types/public-employees.store.types";

export class PublicEmployeesFilter {
    readonly filters: TFilterPublicEmployees = {
        id: undefined,
        id2: undefined,
        specialitiesName: undefined,
        specialities: undefined,
        specialities2: undefined,
        orderName: undefined,
        orderCreatedAt: undefined,
        orderPosition: undefined,
        xAvatar: '1'
    };

    constructor(filters?: TFilterPublicEmployees) {
        if (filters) {
            Object.assign(this.filters, filters);
        }
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
            this.filters.id,
            this.filters.id2,
            this.filters.specialitiesName,
            this.filters.specialities,
            this.filters.specialities2,
            this.filters.orderName,
            this.filters.orderCreatedAt,
            this.filters.orderPosition,
            this.filters.xAvatar,
        ];
    }
}