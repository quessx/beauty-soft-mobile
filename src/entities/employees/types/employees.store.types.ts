import { EmployeeJsonldEmployeeWrite, ScheduleDayJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead } from "@api/index";
import { EmployeesStore } from "../employees.store";

export interface IEmployeesStore extends InstanceType<typeof EmployeesStore> { }

export type TFilterEmployees = {
    id?: string,
    id2?: Array<string>,
    specialitiesName?: string,
    specialities?: string,
    specialities2?: Array<string>,
    orderName?: 'asc' | 'desc',
    orderCreatedAt?: 'asc' | 'desc',
    orderPosition?: 'asc' | 'desc',
    q?: string,
    fired?: boolean,
    xLastScheduledDay?: string,
    xAvatar?: string,
    [key: string]: any;
};

export type TEmployeeLastScheduledDay = ScheduleDayJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead & {
    '@id'?: string,
    '@type'?: string,
    day?: string,
    employee?: string;
} | null | undefined;

export type TRequiredFileds = Extract<"name" | "lastName" | "email", keyof EmployeeJsonldEmployeeWrite>;

export type TSetFilter = {
    name: keyof TFilterEmployees,
    values: Array<any>;
};

export type TTempSpecialityThatNeedToBeDeleted = {
    id: string,
    name?: string
}