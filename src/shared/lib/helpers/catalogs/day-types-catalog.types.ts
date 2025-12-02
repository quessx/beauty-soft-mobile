export namespace DayTypesCatalogTypes {
    export type DayTypesCatalogEnum = 'vacation' | 'rest' | 'work' | 'missing' | 'sick';
    export const DayTypesCatalogEnum = {
        work: 'work' as DayTypesCatalogEnum,
        sick: 'sick' as DayTypesCatalogEnum,
        vacation: 'vacation' as DayTypesCatalogEnum,
        rest: 'rest' as DayTypesCatalogEnum,
        missing: 'missing' as DayTypesCatalogEnum,
    };

    export type DayTypesCatalogEnumFull = 'vacation' | 'rest' | 'work' | 'break' | 'missing' | 'empty-block';
    export const DayTypesCatalogEnumFull = {
        vacation: 'vacation' as DayTypesCatalogEnumFull,
        rest: 'rest' as DayTypesCatalogEnumFull,
        work: 'work' as DayTypesCatalogEnumFull,
        break: 'break' as DayTypesCatalogEnumFull,
        missing: 'missing' as DayTypesCatalogEnumFull,
        empty: 'empty-block' as DayTypesCatalogEnumFull,
    };

    export type DayTypesWithServer = 'VacationScheduleDay' | 'RestScheduleDay' | 'WorkScheduleDay' | 'BreakScheduleDay' | 'MissingScheduleDay';
    export const DayTypesWithServer = {
        vacation: 'VacationScheduleDay' as DayTypesWithServer,
        rest: 'RestScheduleDay' as DayTypesWithServer,
        work: 'WorkScheduleDay' as DayTypesWithServer,
        break: 'BreakScheduleDay' as DayTypesWithServer,
        missing: 'MissingScheduleDay' as DayTypesWithServer,
    };
}
