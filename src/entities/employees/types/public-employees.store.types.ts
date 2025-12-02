import { PublicEmployeesFilter } from "../api/public-employees.store.filter.class";

export type TFilterPublicEmployees = {
    id?: string, 
    id2?: Array<string>, 
    specialitiesName?: string, 
    specialities?: string, 
    specialities2?: Array<string>, 
    orderName?: 'asc' | 'desc', 
    orderCreatedAt?: 'asc' | 'desc', 
    orderPosition?: 'asc' | 'desc', 
    xAvatar?: string
    [key: string]: any;
}

export type TPublicEmployeesFilter = {orgId: string, restFilter: PublicEmployeesFilter}