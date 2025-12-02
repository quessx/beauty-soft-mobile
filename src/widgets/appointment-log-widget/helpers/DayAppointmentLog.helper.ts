import { computed, Signal } from "@angular/core";
import { AppointmentJsonldWorkScheduleDayRead, ScheduleDayPartJsonldWorkScheduleDayRead, WorkScheduleDayJsonldAppointmentRead, WorkScheduleDayJsonldWorkScheduleDayWriteFromToTimeWriteScheduleDayWrite } from "@api/index";
import moment from "moment";
import { TEmployeeTimings } from "@lib/types/employee";
import { EmployeeEntity, TTempSpecialityThatNeedToBeDeleted } from "@entities/employees";
import { WorkScheduleDayEntity } from "@entities/work-schedule-day";
import { Helper } from "@lib/helpers/Helper.functions";
import { AppointmentLogWidgetComponent } from "../appointment-log-widget.component";
import { AppointmentLogScheduletEventModel, AppointmentReadWithScheduleDay } from "@lib/types/appointment-log-schedule-event";
import { EmployeeResourceModel } from "@lib/types/employee-resource";

export class DayAppointmentLogHelper {

    constructor(private appointmentLogComponent: AppointmentLogWidgetComponent) {

    }

    public employeeModels: Signal<EmployeeResourceModel[]> = computed(() => {
        const employeesTimings: TEmployeeTimings[] = [];
        let employeeIds: string[] = this.appointmentLogComponent.workScheduleDaysStore.getCollectionAsDate(this.appointmentLogComponent.date()).map((day: WorkScheduleDayEntity) => {
            employeesTimings.push({ id: day.employee.id, fromTime: day.fromTime, toTime: day.toTime });
            return day.employee.id;
        });
        if (!this.appointmentLogComponent.employeesStore.entities().length) {
            return [];
        }
        let selectedSpecialityId: string = this.appointmentLogComponent.specialityStore.selectedId();
        let filterFunction = (employee: EmployeeEntity) => !!employee && employee?.specialities?.find((speciality: TTempSpecialityThatNeedToBeDeleted) => Helper.getUIDFromAtId(speciality.id) === selectedSpecialityId);

        let workingEmployees: EmployeeEntity[] = employeeIds.map((employeeId: string) => {
            return this.appointmentLogComponent.employeesStore.entityMap()[employeeId];
        }).filter(selectedSpecialityId ? filterFunction : Boolean);

        const othersEmployees: EmployeeResourceModel[] = this.appointmentLogComponent.employeesStore.entities().filter((emp: EmployeeEntity) => !employeeIds.includes(emp.id)).map((e: EmployeeEntity) => {
            let spec: string = '';
            if (Array.isArray(e.specialities)) {
                spec = this.appointmentLogComponent.specialityStore.getById(Helper.getUIDFromAtId(e.specialities[0]?.id))?.name || '';
            }
            return new EmployeeResourceModel({
                id: e.id,
                image: e.avatar?.contentUrl || '',
                name: e.name,
                speciality: spec,
                fullName: e.fullName
            });
        });
        
        let data: EmployeeResourceModel[] = workingEmployees.map((employee: EmployeeEntity) => {
            let speciality: string = '';
            if (employee?.specialities && Array.isArray(employee.specialities) && !!employee.specialities.length) {
                speciality = this.appointmentLogComponent.specialityStore.getById(Helper.getUIDFromAtId(employee.specialities[0]?.id))?.name || '';
            }
            const employeeTimings: TEmployeeTimings | undefined = employeesTimings.find((it) => it.id === employee.id);
            return new EmployeeResourceModel({
                id: employee?.id,
                fullName: employee.fullName,
                image: employee?.avatar?.contentUrl || '',
                name: employee?.name,
                middleName: employee?.middleName || '',
                lastName: employee?.lastName || '',
                speciality: speciality,
                fromTime: employeeTimings?.fromTime,
                toTime: employeeTimings?.toTime
            });
        });
        return data.concat(othersEmployees);
    });

    public events: Signal<AppointmentLogScheduletEventModel[]> = computed(() => {
        const toInputEventTimeFirmat = (date: moment.Moment, time: string) => {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            return date.add(hours, 'hours').add(minutes, 'minutes').add(seconds || 0, 'seconds').toISOString();
        };
        let events: AppointmentLogScheduletEventModel[] = [];
        this.appointmentLogComponent.workScheduleDaysStore.getCollectionAsDate(this.appointmentLogComponent.date()).forEach((day: WorkScheduleDayEntity) => {
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
                        '@id': (appointmentData.scheduleDay as WorkScheduleDayJsonldAppointmentRead)['@id'],
                        fromTime: (appointmentData.scheduleDay as WorkScheduleDayJsonldWorkScheduleDayWriteFromToTimeWriteScheduleDayWrite)?.fromTime || null,
                        toTime: (appointmentData.scheduleDay as WorkScheduleDayJsonldWorkScheduleDayWriteFromToTimeWriteScheduleDayWrite)?.toTime || null
                    },
                    state: appointmentData.state,
                    type: 'appointment',
                    createdByRole: appointmentData.createdByRole || '',
                    items: appointmentData.items ? appointmentData.items.map((item: any) => ({
                        name: item.employeeService?.service?.name || item.good?.name
                    })) : [],
                    client: {
                        '@id': this.appointmentLogComponent.clientsStore.entityMap()[appointmentData.client.id]?.['@id'] || '',
                        id: this.appointmentLogComponent.clientsStore.entityMap()[appointmentData.client.id]?.id || '',
                        phone: this.appointmentLogComponent.clientsStore.entityMap()[appointmentData.client.id]?.phone || '',
                        name: this.appointmentLogComponent.clientsStore.entityMap()[appointmentData.client.id]?.name || '',
                        lastName: this.appointmentLogComponent.clientsStore.entityMap()[appointmentData.client.id]?.lastName || ''
                    },
                    paid: appointmentData.paid,
                    note: appointmentData.note,
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
