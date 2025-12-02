import { computed, Signal } from "@angular/core";
import { AppointmentJsonldWorkScheduleDayRead, ScheduleDayPartJsonldWorkScheduleDayRead, WorkScheduleDayJsonldWorkScheduleDayWriteFromToTimeWriteScheduleDayWrite } from "@api/index";
import { WorkScheduleDayEntity } from "@entities/work-schedule-day";
import { AppointmentLogScheduletEventModel, AppointmentReadWithScheduleDay } from "@lib/types/appointment-log-schedule-event";
import moment from "moment";
import { AppointmentLogWidgetComponent } from "../appointment-log-widget.component";

export class WeekAppointmentLogHelper {

    constructor(private appointmentLogComponent: AppointmentLogWidgetComponent) {

    }

    public events: Signal<AppointmentLogScheduletEventModel[]> = computed(() => {
        const toInputEventTimeFirmat = (date: moment.Moment, time: string) => {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            return date.add(hours, 'hours').add(minutes, 'minutes').add(seconds || 0, 'seconds').toISOString();
        };
        let events: AppointmentLogScheduletEventModel[] = [];
        this.appointmentLogComponent.workScheduleDaysStore.getCollectionByEmployeeId().forEach((day: WorkScheduleDayEntity) => {
            (day.appointments || []).forEach((dayAppointment: AppointmentJsonldWorkScheduleDayRead) => {
                let appointmentData: AppointmentReadWithScheduleDay = this.appointmentLogComponent.appointmentsStore.entityMap()[dayAppointment.id];
                if (!appointmentData) {
                    return;
                }
                let appointment: AppointmentLogScheduletEventModel = new AppointmentLogScheduletEventModel({
                    resourceId: day.employee.id,
                    id: dayAppointment.id,
                    title: dayAppointment.fromTime + ' - ' + dayAppointment.toTime,
                    start: toInputEventTimeFirmat(moment(day.day), dayAppointment.fromTime || '00:00:00'),
                    end: toInputEventTimeFirmat(moment(day.day), dayAppointment.toTime || '00:00:00'),
                    scheduleDayTime: {
                        fromTime: (appointmentData.scheduleDay as WorkScheduleDayJsonldWorkScheduleDayWriteFromToTimeWriteScheduleDayWrite)?.fromTime || null,
                        toTime: (appointmentData.scheduleDay as WorkScheduleDayJsonldWorkScheduleDayWriteFromToTimeWriteScheduleDayWrite)?.toTime || null
                    },
                    state: appointmentData.state,
                    type: 'appointment',
                    items: appointmentData.items ? appointmentData.items.map((item: any) => ({
                        name: item.employeeService?.service?.name || item.good?.name
                    })) : [],
                    client: {
                        phone: this.appointmentLogComponent.clientsStore.entityMap()[appointmentData.client.id]?.phone || '',
                        name: this.appointmentLogComponent.clientsStore.entityMap()[appointmentData.client.id]?.name || '',
                        lastName: this.appointmentLogComponent.clientsStore.entityMap()[appointmentData.client.id]?.lastName || ''
                    },
                    appointment_color: appointmentData.color
                });
                events.push(appointment);
            });
            (day.dayParts || []).forEach((dayAppointment: ScheduleDayPartJsonldWorkScheduleDayRead) => {
                let appointment: AppointmentLogScheduletEventModel = new AppointmentLogScheduletEventModel({
                    resourceId: day.employee.id,
                    id: dayAppointment.id,
                    title: `${moment(dayAppointment.fromTime, 'HH:mm:ss').format('HH:mm')} - ${moment(dayAppointment.toTime, 'HH:mm:ss').format('HH:mm')}`,
                    start: toInputEventTimeFirmat(moment(day.day), dayAppointment.fromTime || '00:00:00'),
                    end: toInputEventTimeFirmat(moment(day.day), dayAppointment.toTime || '00:00:00'),
                    type: 'break'
                });
                events.push(appointment);
            });
        });
        events = events.sort((a, b) => {
            if (a.start < b.start) {
                return -1;
            };
            if (a.start > b.start) {
                return 1;
            };
            return 0;
        });
        return events;
    });
}

