import { LanguageService } from "@i18n/language.service";
import { EmployeeEntity } from "./EmployeeEntity.model";
import { TEmployeeLastScheduledDay } from "../types/employees.store.types";

export class EmployeeCardModel {
    private img: string = '';
    private speciality: string = '';
    private lastCalendarDate: string = '';
    private id: string = '';
    readonly fired: boolean = false;
    readonly position: number | undefined;
    readonly phone: string = '';
    readonly firstName: string = '';
    readonly lastName: string = '';
    readonly email: string = '';

    constructor(employee: EmployeeEntity, speciality: string = '') {
        if (!employee) {
            return;
        }

        this.img = employee.avatar?.contentUrl || '';
        this.lastCalendarDate = this.getLastCalendarDateWithlocaleString(employee.lastScheduledDay);
        this.speciality = speciality;
        this.id = employee.id;
        this.phone = employee.phone;
        this.fired = employee.state == "fired";
        this.position = employee.position;
        this.firstName = employee.name;
        this.lastName = employee?.lastName || '';
        this.email = employee.email || '';
    }

    private getLastCalendarDateWithlocaleString(model: TEmployeeLastScheduledDay): string {
        if (!model || !model.day) {
            return '';
        }
        const date = new Date(model.day ?? '');
        const months = LanguageService.translate('front_general.date.months').split(',');
        // Получаем число и месяц из даты
        const day = date.getDate();
        const month = months[date.getMonth()];

        // Формируем строку
        return `${day} ${month}`;
    }

    getName(): string {
        let name: string =  this.firstName;
        if (this.lastName) {
            name += ' ' + this.lastName;
        }
        return name;
    }

    getImg(): string {
        return this.img;
    }

    getLastCalendarDate(): string {
        return this.lastCalendarDate;
    }

    getSpeciality(): string {
        return this.speciality;
    }

    getId(): string {
        return this.id;
    }
}
