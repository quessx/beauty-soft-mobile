import { ResourceInput } from "@fullcalendar/resource/index.js";

export class EmployeeResourceModel implements ResourceInput {
    id: string;
    image: string;
    fullName: string;
    firstName: string;
    speciality: string;
    fromTime?: string;
    toTime?: string;
    self: EmployeeResourceModel = this;

    constructor(employee: TInitEmployeeModelResource) {
        if (!employee) {
            throw new Error('Missing required properties for UserModelResource');
        }
        this.id = employee.id;
        this.image = employee.image;
        this.firstName = employee.name;
        this.speciality = employee.speciality;
        this.fromTime = employee.fromTime;
        this.toTime = employee.toTime;
        this.fullName = employee.fullName || '';
    }

    getSpeciality(): string {
        return this.speciality;
    }

    getImg(): string {
        return this.image;
    }

    getFullName(): string {
        return this.fullName;
    }

    getFirstName(): string {
        return this.firstName;
    }
}

export type TInitEmployeeModelResource = TEmployeeModelAsResource & {
    id: string;
    middleName?: string;
    lastName?: string;
    fullName?: string;
    fromTime?: string;
    toTime?: string;
}

export type TEmployeeModelAsResource = {
    image: string;
    name: string;
    speciality: string;
}