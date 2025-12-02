import { GoodGoodWrite } from "@api/index";
import { GoodStore } from "../good.store";

export interface IGoodStore extends InstanceType<typeof GoodStore> {}

export type TFilterGood = {
    page?: number,
    itemsPerPage?: number,
    pagination?: boolean,
    name?: string,
    q?: string,
    [key: string]: any;
}

export type TGoodGoodWriteWithId = GoodGoodWrite & {
    id: string;
}
