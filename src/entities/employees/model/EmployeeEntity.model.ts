import { EmployeeJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead, ImageJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead, SpecialityJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead } from "@api/index";
import { TEmployeeLastScheduledDay, TTempSpecialityThatNeedToBeDeleted } from "../types/employees.store.types";
import { ISpecialityStore } from "@entities/speciality";
import { EmployeeCardModel } from "./EmployeeCard.model";
import { Helper } from "@lib/helpers/Helper.functions";

export class EmployeeEntity /*implements EmployeeJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead*/ {
    id: string;
    '@id'?: string | undefined;
    '@type'?: string;
    avatar?: ImageJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead & {
        '@id'?: string,
        '@type'?: string,
        contentUrl?: string,
        uploadDate?: string;
    } | null | undefined;
    email: string | null | undefined;
    gender?: EmployeeJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead.GenderEnum | undefined;
    lastName?: string | null | undefined;
    lastScheduledDay?: TEmployeeLastScheduledDay;
    middleName?: string | null | undefined;
    name: string;
    phone: string;
    position?: number | undefined;
    specialities?: TTempSpecialityThatNeedToBeDeleted[]; // TODO
    state?: string | undefined;
    fullName?: string;

    constructor(data: EmployeeJsonldEmployeeReadIdReadEmployeeAvatarReadEmployeeLastScheduledDayReadSpecialityRead & { fullName?: string }) {
        Object.assign(this, data);
        this.id = data.id;
        this["@id"] = data["@id"];
        this["@type"] = data['@type'];
        this.avatar = data.avatar;
        this.email = data.email || '';
        this.gender = data.gender;
        this.lastName = data.lastName;
        this.lastScheduledDay = data.lastScheduledDay;
        this.middleName = data.middleName;
        this.name = data.name;
        this.phone = data.phone;
        this.position = data.position;
        this.specialities = data.specialities;
        this.state = data.state;
        this.fullName = data.fullName
    }

    static getEmployeesModel(entities: EmployeeEntity[], specialityStore: ISpecialityStore): EmployeeCardModel[] {
        return entities.map((employee: EmployeeEntity) => {
            return EmployeeEntity.getEmployeeModel(employee, specialityStore);
        });
    };

    static getEmployeeModel(entity: EmployeeEntity, specialityStore: ISpecialityStore): EmployeeCardModel {
        let speciality: string = '';
        if (entity?.specialities && Array.isArray(entity.specialities) && !!entity.specialities.length) {
            if (entity.specialities[0]?.name) {
                speciality = entity.specialities[0].name;
            } else {
                speciality = specialityStore.getById(Helper.getUIDFromAtId(entity.specialities[0]?.id))?.name || '';
            }

        }
        return new EmployeeCardModel(entity, speciality);
    }
}