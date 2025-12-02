import { WritableSignal } from "@angular/core";
import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { AppointmentAppointmentRead, AppointmentItemJsonldAppointmentRead, AppointmentJsonldAppointmentRead, ClientJsonldClientRead, GoodAppointmentItemJsonldGoodAppointmentItemWriteAppointmentItemWrite, ServiceAppointmentItemJsonldServiceAppointmentItemWriteAppointmentItemWrite, ServiceJsonldEmployeeServiceReadServiceReadServiceGroupNameReadIdRead } from "@api/index";
import { TUpdateAppointmentItem } from "@entities/service-appointment-Item";
import { TUpdateAppointmentItemGood } from "@entities/good-appointment-Item";
import { GoodEntity } from "@entities/good";
import { EmployeeServiceEntity } from "@entities/employee-service";
import { TuiTime } from '@taiga-ui/cdk';

export type TAppointmentData = {
    id: string;
    employeeId: string;
    state: AppointmentAppointmentRead.StateEnum,
    date: string;
    fromTime: TuiTime;
    toTime: TuiTime;
    comment: string;
    selected_service_ids: string[];
    selected_services: Partial<TSelectedService>[];
    appointment_color: AppointmentJsonldAppointmentRead.ColorEnum | undefined | null;
};

export type TSelectedService = {
    id: string;
    count: number;
    price: number;
    discount_percent: number;
    total_price: number;
    title: string;
    ['@id']?: string
    itemId?: string
};

export type TSelectedServiceForm = {
    [K in keyof TSelectedService]: FormControl<TSelectedService[K]>;
};

export type TAppointmentDataForm = {
    [K in keyof TAppointmentData]: K extends 'selected_services'
        ? FormArray<FormGroup<TSelectedServiceForm>>
        : FormControl<TAppointmentData[K]>;
};

export type TAppointmentDetailClientInfoData = {
    id: string;
    name: string;
    phone: string;
    email: string;
    note: string;
    _phone: string;
    _name: string;
};

export type TAppointmentDetailClientInfoDataForm = {
    [K in keyof TAppointmentDetailClientInfoData]: FormControl<TAppointmentDetailClientInfoData[K]>;
};

export interface ModifiedGoodAppointmentItemJsonldGoodAppointmentItemWriteAppointmentItemWrite extends Omit<
    GoodAppointmentItemJsonldGoodAppointmentItemWriteAppointmentItemWrite,
    'good'
> {}

export interface ModifiedServiceAppointmentItemJsonldServiceAppointmentItemWriteAppointmentItemWrite extends Omit<
    ServiceAppointmentItemJsonldServiceAppointmentItemWriteAppointmentItemWrite,
    'employeeService'
> {}

export type TUpdateGoodsData = {
    adding: GoodAppointmentItemJsonldGoodAppointmentItemWriteAppointmentItemWrite[],
    removed: string[],
    updated: TUpdateAppointmentItemGood[]
}

export type TUpdateServicesData = {
    adding: ServiceAppointmentItemJsonldServiceAppointmentItemWriteAppointmentItemWrite[],
    removed: string[],
    updated: TUpdateAppointmentItem[]
}

export type TAppoinmentItems = AppointmentItemJsonldAppointmentRead & { // todo delete
    employeeService?: {
        id: string,
        service: ServiceJsonldEmployeeServiceReadServiceReadServiceGroupNameReadIdRead
    },
    good?: {
        id: string,
        name: string
    },
}

export type TAddGood = GoodEntity & {
    count?: number,
    discount_percent?: number
    itemId?: string
}

export type TAddToFormService = EmployeeServiceEntity & {
    count?: number,
    discount_percent?: number,
    itemId?: string
}

export interface IAppointmentDataService<T extends { [K in keyof T]: AbstractControl<any, any>; } = TAppointmentDataForm> {
    getForm(): FormGroup<T>,
    getClientForm(): FormGroup<TAppointmentDetailClientInfoDataForm>,
    putClientForm(client: ClientJsonldClientRead): void
    createUpdateCounter?: WritableSignal<number>,
}

export type TStateLeftMenu = 'new' | 'change' | 'new_client'
