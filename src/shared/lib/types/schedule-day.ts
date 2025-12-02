import { EventInput } from "@fullcalendar/core/index.js";
import { Dictionary } from "@fullcalendar/core/internal";
import { DayTypesCatalogTypes } from "@lib/helpers/catalogs";

export class ScheduleDayModel implements EventInput {
    id: string = '';
    _id: string = '';
    type: DayTypesCatalogTypes.DayTypesCatalogEnumFull = DayTypesCatalogTypes.DayTypesCatalogEnumFull.work;
    title: string = '';
    start: string = '';
    _start: string = '';
    end: string = '';
    _end: string = '';
    extendedProps?: Dictionary | undefined;
    classNames?: (string | string[]) | undefined;

    constructor(data: EventInput) {
        if (data) {
            Object.assign(this, data);
        }
    }

    getTypeAsDayTypesCatalogEnum(): DayTypesCatalogTypes.DayTypesCatalogEnum {
        if (DayTypesCatalogTypes.DayTypesCatalogEnumFull.break === this.type) {
            return DayTypesCatalogTypes.DayTypesCatalogEnum.work;
        }
        return this.type as DayTypesCatalogTypes.DayTypesCatalogEnum;
    }

    getId(): string {
        return this._id;
    }

    getStart(): string {
        return this._start;
    }

    getEnd(): string {
        return this._end;
    }
}