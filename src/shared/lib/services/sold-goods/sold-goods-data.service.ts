import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientJsonldClientRead } from '@api/index';
import { IAppointmentDataService, TAddGood, TAppointmentDetailClientInfoDataForm, TSelectedServiceForm } from '@lib/services/appointment';
import { TuiTime } from '@taiga-ui/cdk';
import moment from 'moment';
import { filter } from 'rxjs';
import { TSoldGoodsDataForm } from './sold-goods-data.types';
import { UpdateCreateClientSoldGoodsHelper } from './UpdateCreateClientSoldGoods.helper';
import { UpdateCreateSoldGoodsHelper } from './UpdateCreateSoldGoods.helper';
import { ClientsStore } from '@entities/clients';
import { SoldGoodsGeneralService } from './sold-goods-general.service';
import { DefaultOverlayService } from '../default-overlay';

@Injectable({
    providedIn: 'root'
})
export class SoldGoodsDataService implements IAppointmentDataService<TSoldGoodsDataForm> {
    private fb: FormBuilder = inject(FormBuilder);
    private soldGoodsGeneralService: SoldGoodsGeneralService = inject(SoldGoodsGeneralService);
    private updateCreateSoldGoodsHelper: UpdateCreateSoldGoodsHelper = inject(UpdateCreateSoldGoodsHelper);
    private updateCreateClientSoldGoodsHelper: UpdateCreateClientSoldGoodsHelper = inject(UpdateCreateClientSoldGoodsHelper);
    private clientsStore = inject(ClientsStore);
    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private defaultOverlayService: DefaultOverlayService = inject(DefaultOverlayService);

    private form: FormGroup<TSoldGoodsDataForm> = this.fb.nonNullable.group<TSoldGoodsDataForm>({
        id: this.fb.nonNullable.control(''),
        employeeId: this.fb.nonNullable.control(''),
        date: this.fb.nonNullable.control(moment().format('DD/MM/YYYY')),
        time: this.fb.nonNullable.control(new TuiTime(+moment().format('HH'), +moment().format('mm'))),
        comment: this.fb.nonNullable.control(''),
        selected_service_ids: this.fb.nonNullable.control([]),
        selected_services: this.fb.nonNullable.array([] as FormGroup<TSelectedServiceForm>[]),
    });

    private clientForm: FormGroup<TAppointmentDetailClientInfoDataForm> = this.fb.nonNullable.group<TAppointmentDetailClientInfoDataForm>({
        id: this.fb.nonNullable.control(''),
        name: this.fb.nonNullable.control('', [Validators.required]),
        phone: this.fb.nonNullable.control('', [Validators.required]),
        email: this.fb.nonNullable.control(''),
        note: this.fb.nonNullable.control(''),
        _name: this.fb.nonNullable.control(''),
        _phone: this.fb.nonNullable.control(''),
    });

    constructor() {
        this.soldGoodsGeneralService.getSaveButtonSabjectAsObservable().pipe(takeUntilDestroyed()).subscribe(this.onSaveEvent.bind(this));
        this.soldGoodsGeneralService.getPayButtonSubjectAsObservable().pipe(takeUntilDestroyed()).subscribe(this.onPayEvent.bind(this));
        this.soldGoodsGeneralService.getPayUpdateButtonSubjectAsObservable().pipe(takeUntilDestroyed()).subscribe(this.onPayEvent.bind(this));
        toObservable(this.soldGoodsGeneralService.onPayEvent).pipe(
            takeUntilDestroyed(),
            filter((value: boolean) => value),
        ).subscribe(() => {
            this.soldGoodsGeneralService.onPayEvent.set(false);
            this.router.navigate(['/booking'], { relativeTo: this.route, queryParamsHandling: 'merge', });
        });
    }

    private onPayEvent(): void {
        this.defaultOverlayService.show();
        this.soldGoodsGeneralService.onNewPayEvent.set(true);
        this.onSaveEvent();
    }

    public setEmployeeId(value: string): this {
        this.form.patchValue({ employeeId: value });
        return this;
    }

    public clearForm(): void {
        this.form.reset();
        this.clientForm.reset();
        this.selectedServices?.clear();
    }

    public init(route: ActivatedRoute): this {
        return this;
    }

    getForm(): FormGroup<TSoldGoodsDataForm> {
        return this.form;
    }

    getClientForm(): FormGroup<TAppointmentDetailClientInfoDataForm> {
        return this.clientForm;
    }

    get selectedServices(): FormArray<FormGroup<TSelectedServiceForm>> {
        return this.getForm().get("selected_services") as FormArray<FormGroup<TSelectedServiceForm>>;
    }

    private getClient(): ClientJsonldClientRead | undefined {
        let clientId: string | undefined = this.getClientForm().get('phone')?.value;
        let client: ClientJsonldClientRead | undefined = this.clientsStore.entityMap()[clientId || ''];
        if (!client) {
            return;
        }
        return client;
    }

    public addGood(good: TAddGood): void {
        let client: ClientJsonldClientRead | undefined = this.getClient();
        this.selectedServices.push(this.fb.group<TSelectedServiceForm>({
            id: this.fb.nonNullable.control(good.id),
            price: this.fb.nonNullable.control(Number(good.price?.amount || 0)),
            discount_percent: this.fb.nonNullable.control(client?.discount || good.discount_percent || 0),
            total_price: this.fb.nonNullable.control(Number(good.price?.amount || 0)),
            count: this.fb.nonNullable.control(good.count || 1),
            title: this.fb.nonNullable.control(good.name || ''),
        }));
    }

    public removeService(index: number, ev?: Event): void {
        ev?.stopPropagation();
        let itemId: string | undefined = this.selectedServices.value[index]?.id;
        this.selectedServices.removeAt(index);
        let selectedServiceIds: string[] | undefined = this.getForm().get('selected_service_ids')?.value
        if (!itemId || !selectedServiceIds) {
            return;
        }
        selectedServiceIds = selectedServiceIds.filter((id: string) => id !== itemId);
        this.getForm().patchValue({ selected_service_ids: selectedServiceIds });
    }

    public remomeServiseById(id: string): void {
        let item: FormGroup<TSelectedServiceForm> | undefined = this.selectedServices.controls.find((control: FormGroup<TSelectedServiceForm>) => control.get('id')?.value === id);
        if (!item) {
            return;
        }
        let index: number = this.selectedServices.controls.indexOf(item);
        this.removeService(index);
    }

    private onSaveEvent(): void {
        let clientId: string | undefined = this.getClientForm().get('phone')?.value;
        this.updateCreateClientSoldGoodsHelper.setDataService(this);
        if (!clientId) {
            this.updateCreateClientSoldGoodsHelper.onCreateClientEvent();
        } else {
            this.updateCreateSoldGoodsHelper.setDataService(this).onSaveEvent();
            this.updateCreateClientSoldGoodsHelper.onUpdateClientEvent(clientId);
        }
    }

    public putClientForm(client: ClientJsonldClientRead): void {
        this.clientForm.patchValue({
            name: client.id,
            id: client['@id'] || '',
            phone: client.id,
            email: client.email || '',
            note: client.comment || '',
            _name: '',
            _phone: ''
        }, { emitEvent: false });
        this.selectedServices.controls.forEach((control: FormGroup<TSelectedServiceForm>) => {
            if (!control) {
                return;
            }
            control.get('discount_percent')?.patchValue(client.discount || 0);
        });
    }
}
