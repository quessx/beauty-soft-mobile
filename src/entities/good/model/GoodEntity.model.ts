import { GoodGroupJsonldGoodReadIdReadGoodGroupNameRead, GoodJsonldGoodReadIdReadGoodGroupNameRead, MoneyJsonld } from "@api/index";

export class GoodEntity implements GoodJsonldGoodReadIdReadGoodGroupNameRead {
    id: string;
    '@id'?: string | undefined;
    '@type'?: string;
    goodGroup?: GoodGroupJsonldGoodReadIdReadGoodGroupNameRead | undefined;
    name: string;
    price: MoneyJsonld;

    constructor(data: GoodJsonldGoodReadIdReadGoodGroupNameRead) {
        Object.assign(this, data);
        this.id = data.id;
        this["@id"] = data["@id"];
        this["@type"] = data['@type'];
        this.goodGroup = data.goodGroup;
        this.name = data.name;
        this.price = data.price;
    }
}