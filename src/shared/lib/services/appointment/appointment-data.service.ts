import { inject, Injectable, OnDestroy, signal, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientJsonldClientRead } from '@api/index';
import { AppointmentsStore, IAppointmentsStore } from '@entities/appointments';
import { ClientsStore, IClientsStore } from '@entities/clients';
import { IOrderItemInfo } from '@features/add-order-feature';
import { TuiTime } from '@taiga-ui/cdk';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { IAppointmentDataService, TAddGood, TAddToFormService, TAppointmentDataForm, TAppointmentDetailClientInfoDataForm, TSelectedServiceForm } from './appointment-data.types';
import { AppointmentGeneralService } from './appointment-general.service';
import { UpdateCreateAppointmentHelper } from './UpdateCreateAppointment.helper';
import { UpdateCreateClientHelper } from './UpdateCreateClient.helper';

@Injectable({
    providedIn: 'root'
})
export class AppointmentDataService implements IAppointmentDataService, OnDestroy {
    private fb: FormBuilder = inject(FormBuilder);
    private appointmentGeneralService: AppointmentGeneralService = inject(AppointmentGeneralService);
    private updateCreateAppointmentHelper: UpdateCreateAppointmentHelper = inject(UpdateCreateAppointmentHelper);
    private updateCreateClientHelper: UpdateCreateClientHelper = inject(UpdateCreateClientHelper);
    private appointmentsStore: IAppointmentsStore = inject(AppointmentsStore);
    private clientsStore: IClientsStore = inject(ClientsStore);
    private form: FormGroup<TAppointmentDataForm> = this.fb.nonNullable.group<TAppointmentDataForm>({
        id: this.fb.nonNullable.control(''),
        employeeId: this.fb.nonNullable.control(''),
        state: this.fb.nonNullable.control('waiting'),
        date: this.fb.nonNullable.control(moment().format('YYYY-MM-DD')),
        fromTime: this.fb.nonNullable.control(new TuiTime(9, 0)),
        toTime: this.fb.nonNullable.control(new TuiTime(10, 0)),
        comment: this.fb.nonNullable.control(''),
        selected_service_ids: this.fb.nonNullable.control([]),
        selected_services: this.fb.nonNullable.array([] as FormGroup<TSelectedServiceForm>[]),
        appointment_color: this.fb.nonNullable.control(undefined)
    });

    private subscriptions: Subscription[] = [];

    // Сигнал для триггера обновления UI при изменении FormArray
    public selectedServicesVersion: WritableSignal<number> = signal(0);

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
        const saveEventSub: Subscription = this.appointmentGeneralService.getSaveButtonSabjectAsObservable().subscribe(() => {
            this.appointmentGeneralService.onSaveEvent.set(false);
            this.onSaveEvent();
        });
        const deleteEventSub: Subscription = this.appointmentGeneralService.getRemoveButtonSubjectAsObservable().subscribe(this.onDeleteEvent.bind(this));
        const payEventSub: Subscription = this.appointmentGeneralService.getPayButtonSubjectAsObservable().subscribe(() => {
            this.appointmentGeneralService.onSaveEvent.set(false);
            this.onSaveEvent();
        });

        this.subscriptions.push(saveEventSub, deleteEventSub, payEventSub);
    }
    public setEmployeeId(value: string): this {
        this.form.patchValue({ employeeId: value });
        return this;
    }

    getForm(): FormGroup<TAppointmentDataForm> {
        return this.form;
    }

    getClientForm(): FormGroup<TAppointmentDetailClientInfoDataForm> {
        return this.clientForm;
    }

    get selectedServices(): FormArray<FormGroup<TSelectedServiceForm>> {
        return this.getForm().get("selected_services") as FormArray<FormGroup<TSelectedServiceForm>>;
    }

    public clearForm(): void {
        this.form.reset();
        this.clientForm.reset();
        this.selectedServices?.clear();
    }

    private getClient(): ClientJsonldClientRead | undefined {
        let clientId: string | undefined = this.getClientForm().get('phone')?.value;
        let client: ClientJsonldClientRead | undefined = this.clientsStore.entityMap()[clientId || ''];
        if (!client) {
            return;
        }
        return client;
    }

    public addService(service: TAddToFormService): void {
        let client: ClientJsonldClientRead | undefined = this.getClient();
        this.selectedServices.push(this.fb.group<TSelectedServiceForm>({
            id: this.fb.nonNullable.control(service.id),
            price: this.fb.nonNullable.control(Number(service.price?.amount || 0)),
            discount_percent: this.fb.nonNullable.control(client?.discount || service.discount_percent || 0),
            total_price: this.fb.nonNullable.control(Number(service.price?.amount || 0)),
            count: this.fb.nonNullable.control(service.count || 1),
            title: this.fb.nonNullable.control(service.service?.name || ''),
            itemId: this.fb.nonNullable.control(service.itemId)
        }));
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
            itemId: this.fb.nonNullable.control(good.itemId)
        }));
    }

    /**
     * Универсальное добавление упрощённого элемента (service/good) в форму, когда у нас только IOrderItemInfo.
     * Используется для live-sync из попапа выбора.
     */
    public addSimpleSelectedItem(info: IOrderItemInfo): void {
        // Предотвращаем дублирование
        const exists: boolean = this.selectedServices.controls.some((ctrl: FormGroup<TSelectedServiceForm>) => ctrl.get('id')?.value === info.item.id);
        if (exists) {
            return;
        }
        const priceNum: number = Number(info.item.price) || 0;
        this.selectedServices.push(this.fb.group<TSelectedServiceForm>({
            id: this.fb.nonNullable.control(info.item.id),
            price: this.fb.nonNullable.control(priceNum),
            discount_percent: this.fb.nonNullable.control(0),
            total_price: this.fb.nonNullable.control(priceNum),
            count: this.fb.nonNullable.control(1),
            title: this.fb.nonNullable.control(info.item.label || ''),
            itemId: this.fb.nonNullable.control(undefined)
        }));
        // Увеличиваем версию для триггера change detection
        this.selectedServicesVersion.update(v => v + 1);
    }

    public removeService(index: number, ev?: Event): void {
        ev?.stopPropagation();
        let itemId: string | undefined = this.selectedServices.value[index]?.id;
        this.selectedServices.removeAt(index);
        // Увеличиваем версию для триггера change detection
        this.selectedServicesVersion.update(v => v + 1);
        let selectedServiceIds: string[] | undefined = this.getForm().get('selected_service_ids')?.value;
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
        this.updateCreateClientHelper.setDataService(this);
        if (!this.clientsStore.selectedId()) {
            this.updateCreateClientHelper.onCreateClientEvent();
        } else {
            this.updateCreateAppointmentHelper.setDataService(this).onSaveEvent();
            this.updateCreateClientHelper.onUpdateClientEvent(this.clientsStore.selectedId());
        }
    }

    private onDeleteEvent(): void {
        let formId: string | undefined = this.getForm().get('id')?.value;
        if (!formId) {
            return;
        }
        this.appointmentsStore.deleteById(formId);
    }
    public checkDuration(durationNew: number): void {
        let fromTime: string = this.getForm().get('fromTime')?.value.toString() || '09:00';
        let newToTime: string = moment(fromTime, 'HH:mm').add(this.roundUpTo30(durationNew), 'minutes').format('HH:mm');
        const [toHours, toMinutes] = newToTime.split(':').map(Number);
        this.getForm().patchValue({ toTime: new TuiTime(toHours, toMinutes) });
    }

    private roundUpTo30(num: number): number {
        if (num % 30 === 0) {
          return num; // Число уже кратно 30
        } else {
          return Math.ceil(num / 30) * 30; // Округляем вверх до ближайшего кратного 30
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

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

}
