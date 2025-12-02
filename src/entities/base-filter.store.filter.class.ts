export abstract class BaseStoreFilter<T extends Record<string, any>> {
    readonly filters: T = {} as T;

    public setFilterByName(name: string, value: any): this {
        if (name in this.filters && typeof name === 'string') {
            (this.filters as Record<string, any>)[name] = value;
        } else {
            throw new Error(`Invalid filter name: ${name}`);
        }
        return this;
    }

    public getFilterByName(name: string): any {
        return this.filters[name];
    }

    abstract getFilter(): any[]
}