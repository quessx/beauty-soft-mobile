import { AppointmentJsonldClientRead, ClientJsonldClientRead, MoneyJsonldClientRead } from "@api/index";

export class ClientEntity implements ClientJsonldClientRead {
    id: string;
    '@id'?: string | undefined;
    '@type'?: string;
    additionalPhoneNumbers?: string[] | null | undefined;
    appointmentsCount?: number | undefined;
    birthDate?: string | null | undefined;
    birthDay?: number | null | undefined;
    comment?: string | null | undefined;
    discount?: number | null | undefined;
    email?: string | null | undefined;
    fullName?: string | undefined;
    gender?: ClientJsonldClientRead.GenderEnum | undefined;
    lastAppointment?: AppointmentJsonldClientRead & {
        scheduleDay?: {
            day?: string;
            '@id'?: string;
            '@type'?: string;
            id?: string;
            employee?: {
                '@id'?: string;
                '@type'?: string;
                id?: string;
            };
        };
    } | null | undefined;
    lastName?: string | null | undefined;
    lastVisit?: string | null | undefined;
    middleName?: string | null | undefined;
    name: string;
    phone: string;
    totalSold?: MoneyJsonldClientRead | undefined;

    constructor(data: ClientJsonldClientRead) {
        Object.assign(this, data);
        this.id = data.id;
        this["@id"] = data["@id"];
        this["@type"] = data['@type'];
        this.additionalPhoneNumbers = data.additionalPhoneNumbers;
        this.appointmentsCount = data.appointmentsCount;
        this.birthDate = data.birthDate;
        this.birthDay = data.birthDay;
        this.comment = data.comment;
        this.discount = data.discount;
        this.email = data.email;
        this.fullName = data.fullName;
        this.gender = data.gender;
        this.lastAppointment = data.lastAppointment;
        this.lastName = data.lastName;
        this.lastVisit = data.lastVisit;
        this.middleName = data.middleName;
        this.name = data.name!;
        this.phone = data.phone!;
        this.totalSold = data.totalSold;

    }
}