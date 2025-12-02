import { inject, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { take } from "rxjs";
import { ValidationPopupsService } from '@lib/services/validation';
import { LanguageService } from '@i18n/language.service';
import { UpdateCreateSoldGoodsHelper } from "./UpdateCreateSoldGoods.helper";
import { IAppointmentDataService, TAppointmentDetailClientInfoData, TAppointmentDetailClientInfoDataForm } from "@lib/services/appointment";
import { TSoldGoodsDataForm } from "./sold-goods-data.types";
import { ClientJsonldClientRead, ClientJsonldClientWrite } from "@api/index";
import { OrganizationStore } from "@entities/organization";
import { ClientsStore, TClientUpdateData } from "@entities/clients";

@Injectable({
    providedIn: 'root'
})
export class UpdateCreateClientSoldGoodsHelper implements IAppointmentDataService<TSoldGoodsDataForm> {
    private clientsStore = inject(ClientsStore);
    private organizationStore = inject(OrganizationStore);
    private dataService: IAppointmentDataService<TSoldGoodsDataForm> | undefined;
    private updateCreateSoldGoodsHelper: UpdateCreateSoldGoodsHelper = inject(UpdateCreateSoldGoodsHelper);
    private validationPopupsService: ValidationPopupsService = inject(ValidationPopupsService);
    private langService: LanguageService = inject(LanguageService);

    public setDataService(dataService: IAppointmentDataService<TSoldGoodsDataForm>): this {
        this.dataService = dataService;
        return this;
    }
    public getForm(): FormGroup<TSoldGoodsDataForm> {
        if (!this.dataService) {
            throw new Error("Data service not set.");
        }
        return this.dataService.getForm();
    }
    public getClientForm(): FormGroup<TAppointmentDetailClientInfoDataForm> {
        if (!this.dataService) {
            throw new Error("Data service not set.");
        }
        return this.dataService.getClientForm();
    }
    checkIsValidForm(): boolean {
        this.validationPopupsService.setInvalidForm(this.getClientForm().controls);
        this.validationPopupsService.clearErrors();
        return  this.validationPopupsService.checkInvalidTextForm(this.getClientForm().controls, this.langService.translate('sold_goods_page_front.errors.required'));
    }
    onCreateClientEvent(): void {
        let organization: string | undefined = this.organizationStore.getSelectedOrganization()["@id"];
        if (!organization) {
            throw new Error("Organization not found.");
        }

        if(!this.checkIsValidForm()) {
            return;
        }

        let client: ClientJsonldClientWrite = {
            organization: organization,
            phone: this.getClientForm().value.phone || '',
            name: this.getClientForm().value.name || '',
            email: this.getClientForm().value.email || undefined,
            comment: this.getClientForm().value.note || undefined
        }

        this.clientsStore.createAsObservable(client).pipe(take(1)).subscribe((newClient: ClientJsonldClientRead) => {
            this.getClientForm().patchValue({
                name: newClient.id,
                phone: newClient.id,
                email: newClient.email || '',
                note: newClient.comment || '',
                _name: '',
                _phone: ''
            }, { emitEvent: false });
            this.getClientForm().patchValue({
                id: newClient['@id'] || '',
            });
            if (!this.dataService) {
                return;
            }
            this.updateCreateSoldGoodsHelper.setDataService(this.dataService).onSaveEvent();
        });
    }

    onUpdateClientEvent(id: string): void {
        let client: ClientJsonldClientRead = this.clientsStore.entityMap()[id];
        let organization: string | undefined = this.organizationStore.getSelectedOrganization()["@id"];
        if (!organization) {
            throw new Error("Organization not found.");
        } else if (!client) {
            throw new Error(`Client with id ${id} not found.`);
        }

        if(!this.checkIsValidForm()) {
            return;
        }

        let formData: Partial<TAppointmentDetailClientInfoData> = this.getClientForm().value;
        let clientData: TClientUpdateData = {
            id,
            client: {
                organization: organization || '',
                phone: client.phone,
                name: client.name,
                email: client.email,
                comment: client.comment
            }
        }
        let isIssetChanges: boolean = false;
        if (!!formData._name) {
            clientData.client.name = formData._name;
            isIssetChanges = true;
        }
        if (!!formData._phone) {
            clientData.client.phone = formData._phone;
            isIssetChanges = true;
        }
        if (client.email !== formData.email && !!formData.email) {
            clientData.client.email = formData.email;
            isIssetChanges = true;
        }
        if (client.comment !== formData.note && !!formData.note) {
            clientData.client.comment = formData.note;
            isIssetChanges = true;
        }
        if (!isIssetChanges) {
            return;
        }
        this.clientsStore.update(clientData);
        this.getClientForm().patchValue({
            _name: '',
            _phone: '',
        })
    }
    public putClientForm(client: ClientJsonldClientRead): void {}
}
