import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { DayTypesCatalogTypes } from "@lib/helpers/catalogs";
import { ScheduleDayModel } from "@lib/types/schedule-day";
import { Moment } from "moment";

export type TEmployeeScheduleSettingsModel = {
    day_type: DayTypesCatalogTypes.DayTypesCatalogEnum;
    fromTime: string;
    toTime: string;
    breaks: Partial<TEmployeeScheduleSettingsBreaksModel>[];
    repeat: boolean;
    repeat_to: string;
}

export type TEmployeeScheduleSettingsBreaksModel = {
    id: string;
    start_time: string;
    end_time: string;
};

export type TEmployeeScheduleSettingsBreaksForm = {
    [K in keyof TEmployeeScheduleSettingsBreaksModel]: FormControl<TEmployeeScheduleSettingsBreaksModel[K]>;
}

export type TEmployeeScheduleSettingsForm = {
    [K in keyof TEmployeeScheduleSettingsModel]: K extends 'breaks'
        ? FormArray<FormGroup<TEmployeeScheduleSettingsBreaksForm>>
        : FormControl<TEmployeeScheduleSettingsModel[K]>;
};

export type TDayModel = {
    day: Moment;
    events: ScheduleDayModel[],
}
