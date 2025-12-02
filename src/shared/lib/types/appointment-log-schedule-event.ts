import { AppointmentAppointmentRead, AppointmentJsonldAppointmentRead, WorkScheduleDayJsonldAppointmentRead, WorkScheduleDayJsonldWorkScheduleDayWriteFromToTimeWriteScheduleDayWrite } from "@api/index";
import { EventInput } from "@fullcalendar/core/index.js";

export class AppointmentLogScheduletEventModel implements EventInput {
    id: string = '';
    title: string = '';
    start: string = '';
    end: string = '';
    resourceId: string = '';
    state: AppointmentAppointmentRead.StateEnum = 'waiting';
    type: string = '';
    //items: AppointmentItemJsonldAppointmentRead[] = [];
    items: AppointmentLogScheduleItem[] = [];
    createdByRole: AppointmentJsonldAppointmentRead.CreatedByRoleEnum | '' = '';
    client: AppointmentLogScheduleClient = {
        phone: '',
        name: '',
        lastName: ''
    };
    scheduleDayTime: {
        fromTime: string,
        toTime: string;
    } = {
            fromTime: '',
            toTime: ''
        };
    note?: string;
    event: AppointmentLogScheduletEventModel = this;
    appointment_color?: AppointmentJsonldAppointmentRead.ColorEnum | null;

    constructor(data: EventInput) {
        if (data) {
            Object.assign(this, data);
        }
    }

    getId(): string {
        return this.id;
    }

    getStart(): string {
        return this.start;
    }

    getEnd(): string {
        return this.end;
    }

    getItems(): AppointmentLogScheduleItem[] {
        return this.items;
    }

    getClientName(): string {
        return this.client.name;
    }

    getClientPhone(): string {
        return this.client.phone;
    }
}


export type AppointmentLogScheduleItem = {
    name: string;
}

export type AppointmentLogScheduleClient = {
    phone: string;
    name: string;
    lastName: string;
}

export type AppointmentReadWithScheduleDay = Omit<AppointmentJsonldAppointmentRead, "scheduleDay"> & {
    scheduleDay: WorkScheduleDayJsonldWorkScheduleDayWriteFromToTimeWriteScheduleDayWrite | WorkScheduleDayJsonldAppointmentRead
}