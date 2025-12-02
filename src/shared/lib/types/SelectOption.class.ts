
export type TSelectOptionMetadata = {
    enum?: string;
    required?: boolean;
    returnType?: string;
    type?: string
}

export type TSelectOptionInit<T extends string = string, MT extends {} = any> = {
    id: string;
    value: T;
    label: string;
    metadata?: MT;
}

export class SelectOption<B extends string = string, M extends {} = any> {
    id: string;
    value: B;
    label: string;
    metadata?: M;

    constructor(data: TSelectOptionInit<B, M>) {
        if (!data?.id || (data?.value === undefined) || (data?.label === undefined)) {
            throw Error("Invalid value or label");
        }
        this.id = data.id;
        this.value = data.value;
        this.label = data.label;
        this.metadata = data.metadata;
    }
}
