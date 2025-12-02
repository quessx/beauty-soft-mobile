import { inject, Injectable } from "@angular/core";
import { take } from "rxjs";
import { FormGroup } from "@angular/forms";
import { ValidationPopupsService } from '@lib/services/validation';
import { IAppointmentDataService, TAppointmentDetailClientInfoDataForm, TSelectedService } from "@lib/services/appointment";
import { GoodSaleItem, TSoldGoodsDataForm, TUpdateSoldGoods, TUpdateSoldGoodsUpdateById } from "./sold-goods-data.types";
import moment from "moment";
import { TuiTime } from '@taiga-ui/cdk';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentPaymentPopupService } from '@ui/popups/appointment-payment-popup';
import { ClientJsonldClientRead, GoodSaleItemJsonldGoodSaleItemWrite, GoodSaleJsonldGoodSaleRead, GoodSaleJsonldGoodSaleWrite } from "@api/index";
import _ from 'lodash';
import { HttpErrorResponse } from "@angular/common/http";
import { GoodSaleItemStore } from "@entities/good-sale-item";
import { GoodSaleStore } from "@entities/good-sale";
import { GoodStore, GoodEntity } from "@entities/good";
import { EmployeesStore } from "@entities/employees";
import { DefaultOverlayService } from "../default-overlay";

@Injectable({
    providedIn: 'root'
})
export class UpdateCreateSoldGoodsHelper implements IAppointmentDataService<TSoldGoodsDataForm> {
    private goodSaleStore = inject(GoodSaleStore);
    private goodSaleItemStore = inject(GoodSaleItemStore);
    private goodStore = inject(GoodStore);
    private employeesStore = inject(EmployeesStore);
    private dataService: IAppointmentDataService<TSoldGoodsDataForm> | undefined;
    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private appointmentPaymentPopupService: AppointmentPaymentPopupService = inject(AppointmentPaymentPopupService);
    protected validationPopupsService: ValidationPopupsService = inject(ValidationPopupsService);
    private defaultOverlayService: DefaultOverlayService = inject(DefaultOverlayService);

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

    public onSaveEvent(): void {
        let appoinmentId: string | undefined = this.getForm().get('id')?.value;
        this.validationPopupsService.setInvalidForm(this.getForm().controls);

        if (!appoinmentId) {
            this.onCreateGoodSaleEvent();
        } else {
            this.onUpdateAppointmentEvent(appoinmentId);
        }
    }

    private getWrireGoodSale(): GoodSaleJsonldGoodSaleWrite | undefined {
        let employeeId: string | undefined = this.getForm().get('employeeId')?.value;
        employeeId = this.employeesStore.entityMap()[employeeId || '']["@id"];

        let fullDate: string | undefined;
        let date: string | undefined = this.getForm().get('date')?.value;
        let time: TuiTime | undefined = this.getForm().get('time')?.value;
        if (date && time) {
            fullDate = this.combineDateTimeToUTC(date, time);
        }
        if (!employeeId || !fullDate) {
            return;
        }
        let data: GoodSaleJsonldGoodSaleWrite = {
            client: this.getClientForm().get('id')?.value || '',
            saleDate: fullDate,
            employee: employeeId,
            note: this.getForm().get('comment')?.value || null
        }
        return data;
    }

    public onCreateGoodSaleEvent(): void {
        let data: GoodSaleJsonldGoodSaleWrite | undefined = this.getWrireGoodSale();
        if (!data) {
            return;
        }
        this.defaultOverlayService.show();
        this.goodSaleStore.createAsObservable(data).pipe(take(1)).subscribe({
            next: (goodSale: GoodSaleJsonldGoodSaleRead): void => {
                this.getForm().patchValue({id: goodSale.id});
                let goods: GoodSaleItemJsonldGoodSaleItemWrite[] = [];

                (this.getForm().get('selected_services')?.value || []).forEach((item: TSelectedService) => {
                    let data: GoodSaleItemJsonldGoodSaleItemWrite = {
                        goodSale: goodSale['@id'] || '',
                        quantity: item.count,
                        price: {
                            amount: item.price + '',
                            currency: 'RUB',
                        },
                        good: ''
                    };
                    if (!!item.discount_percent) {
                        data.discountPercent = item.discount_percent;
                    }

                    let good: GoodEntity | undefined = this.goodStore.entityMap()[item.id];
                    if (!!good) {
                        goods.push({...data, good: good['@id'] || '' });
                        return;
                    }
                });

                if (!goods.length) {
                    this.router.navigate(['/booking'], { relativeTo: this.route, queryParamsHandling: 'merge' });
                    return;
                }
                this.createGoods(goods);
            },
            error: (error: HttpErrorResponse) => {
                console.error('Error creating appointment:', error);
                this.validationPopupsService.setViolations(error?.error?.violations)
            }
        });
    }

    private isGoodSaleChanged(): boolean {
        let olGoodSale: GoodSaleJsonldGoodSaleRead = this.goodSaleStore.entityMap()[this.getForm().get('id')?.value || ''];
        if (!olGoodSale) {
            return false;
        }
        let newWriteGoodSale: GoodSaleJsonldGoodSaleWrite = this.getWrireGoodSale() || {} as GoodSaleJsonldGoodSaleWrite;
        let oldWriteGoodSale: GoodSaleJsonldGoodSaleWrite = {
            client: olGoodSale.client["@id"] || '',
            employee: olGoodSale.employee["@id"] || '',
            note: olGoodSale.note,
            saleDate: olGoodSale.saleDate
        };
        return !_.isEqual(newWriteGoodSale, oldWriteGoodSale);
    }

    public onUpdateAppointmentEvent(appointmentId: string, isNeedCheckChanges: boolean = true): void {
        
        if (isNeedCheckChanges && this.isGoodSaleChanged()) {
            let data: GoodSaleJsonldGoodSaleWrite | undefined = this.getWrireGoodSale();
            if (!data) {
                return;
            }
            this.defaultOverlayService.show();
            this.goodSaleStore.updateAsObservable(appointmentId, data).pipe(take(1)).subscribe({
                next: (goodSale: GoodSaleJsonldGoodSaleRead): void => {
                    this.onUpdateAppointmentEvent(appointmentId, false);
                },
                error: (error: HttpErrorResponse) => {
                    console.error('Error updating appointment:', error);
                    this.validationPopupsService.setViolations(error?.error?.violations)
                }
            });
            return;
        }

        const goodSale: GoodSaleJsonldGoodSaleRead = this.goodSaleStore.entityMap()[appointmentId];
        if (!goodSale) {
            return;
        }
        this.defaultOverlayService.show();
        let goods: TUpdateSoldGoods = {
            create: [],
            update: [],
            remove: []
        };
        let goodsItemsEntitiesMap = new Map();
        (goodSale.items || []).forEach((item: GoodSaleItem) => {
            goodsItemsEntitiesMap.set(item?.good?.id, item);
        });

        goods.update = (this.getForm().get('selected_services')?.value || []).reduce((update: TUpdateSoldGoodsUpdateById[], item: TSelectedService) => {
            let data: GoodSaleItemJsonldGoodSaleItemWrite = {
                goodSale: goodSale['@id'] || '',
                quantity: item.count,
                price: {
                    amount: item.price + '',
                    currency: 'RUB',
                },
                good: ''
            };
            if (!!item.discount_percent) {
                data.discountPercent = item.discount_percent;
            }

            let goodRead: GoodEntity | undefined = this.goodStore.entityMap()[item.id];
            if (!goodsItemsEntitiesMap.has(item?.id)) {
                // Определяем элементы для добавления
                goods.create.push({...data, good: goodRead['@id'] || '',  });
                return update;
            } else if (!!goodRead) {
                update.push({
                    good: { ...data, good: goodRead['@id'] + '' || '' },
                    idItem: goodsItemsEntitiesMap.get(item?.id).id
                });

                // Определяем элементы для удаления
                goodsItemsEntitiesMap.delete(item?.id);
            }

            return update;
        }, []);

        goodsItemsEntitiesMap.forEach((item: GoodSaleItem) => {
            goods.remove.push(item.id);
        });
        this.goodSaleItemStore.deleteGoodsItems(goods.remove).subscribe({
            error: (error: any) => {
                console.error('Error deleting good sale items:', error);
            },
            complete: () => {
                this.defaultOverlayService.show();
                this.goodSaleItemStore.updateGoodsItems(goods.update).subscribe({
                    complete: () => {
                        this.createGoods(goods.create);
                    }
                })
            }
        });
    }

    private createGoods(goods: GoodSaleItemJsonldGoodSaleItemWrite[]) {
        this.defaultOverlayService.show();
        this.goodSaleItemStore.createGoodsItems(goods).subscribe({
            complete: () => {
                const appointmentId: string = this.getForm().controls.id.value;
                this.appointmentPaymentPopupService.setState('goodSale').show(appointmentId);
            },
            error: error => {
                console.error('Error creating good sale item:', error);
                this.validationPopupsService.setViolations(error?.error?.violations)

            }
        });
    }
    private combineDateTimeToUTC(date: string, time: TuiTime): string | undefined {
        if (!date || !time) {
            return; // Или выбросить ошибку, если это необходимо
        }

        // Предполагаем, что date имеет формат DD/MM/YYYY, а time - HH:mm
        const dateParts: string[] = date.split('/');
        const hours: number = time.hours;
        const minutes: number = time.minutes;

        if (dateParts.length !== 3) {
            return; // Или выбросить ошибку, если формат неправильный
        }

        const day: number = parseInt(dateParts[0], 10);
        const month: number = parseInt(dateParts[1], 10) - 1; // Месяцы в JavaScript начинаются с 0
        const year: number = parseInt(dateParts[2], 10);


        const combinedMoment: moment.Moment = moment.utc([year, month, day, hours, minutes]);

        return combinedMoment.toISOString();
    }
    public putClientForm(client: ClientJsonldClientRead): void {}
}
