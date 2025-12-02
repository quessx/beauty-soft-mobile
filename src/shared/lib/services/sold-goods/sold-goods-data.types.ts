import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { GoodJsonldGoodAppointmentItemReadAppointmentItemReadIdRead, GoodJsonldGoodReadIdReadGoodGroupNameRead, GoodSaleItemJsonldGoodSaleItemWrite, GoodSaleItemJsonldGoodSaleRead, MoneyJsonld } from "@api/index";
import { TSelectedService, TSelectedServiceForm } from "@lib/services/appointment";
import { TuiTime } from '@taiga-ui/cdk';

export type TSoldGoodsData = {
    id: string;
    employeeId: string;
    date: string;
    time: TuiTime;
    comment: string;
    selected_service_ids: string[],
    selected_services: Partial<TSelectedService>[]
};

export type TSoldGoodsDataForm = {
    [K in keyof TSoldGoodsData]: K extends 'selected_services'
        ? FormArray<FormGroup<TSelectedServiceForm>>
        : FormControl<TSoldGoodsData[K]>;
};

export type GoodSaleItem = GoodSaleItemJsonldGoodSaleRead & {
    good?: GoodJsonldGoodAppointmentItemReadAppointmentItemReadIdRead & {
        goodGroup?: GoodJsonldGoodReadIdReadGoodGroupNameRead,
        name?: string,
        price?: MoneyJsonld
    },
    price?: MoneyJsonld
    quantity?: number
    total?: MoneyJsonld
}

export type TUpdateSoldGoods = {
    create: GoodSaleItemJsonldGoodSaleItemWrite[],
    update: TUpdateSoldGoodsUpdateById[],
    remove: string[]
}

export type TUpdateSoldGoodsUpdateById = {
    idItem: string,
    good: GoodSaleItemJsonldGoodSaleItemWrite
}


