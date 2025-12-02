import { TFilterGood } from "../types/good.store.types";

export class GoodFilter {
    readonly filters: TFilterGood = {
        page: 1,
        itemsPerPage: 10,
        pagination: false,
        name: undefined,
        q: undefined,
    }

    setFilterByName(name: string, value: any): this {
        if (name in this.filters && typeof name === 'string') {
            this.filters[name] = value;
        } else {
            throw new Error(`Invalid filter name: ${name}`);
        }
        // 
        return this;
    }

    getFilter(): any[] {
        return [
            this.filters.page,
            this.filters.itemsPerPage,
            this.filters.pagination,
            this.filters.name,
            this.filters.q,
        ]
    }
}