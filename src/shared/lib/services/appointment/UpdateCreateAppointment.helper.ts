import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, Injector, signal, WritableSignal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { FormGroup } from "@angular/forms";
import { AppointmentJsonldAppointmentRead, AppointmentJsonldAppointmentWriteFromToTimeWrite, ClientJsonldClientRead, GoodAppointmentItemJsonldGoodAppointmentItemReadAppointmentItemReadIdRead, GoodAppointmentItemJsonldGoodAppointmentItemWriteAppointmentItemWrite, ServiceAppointmentItemJsonldServiceAppointmentItemReadAppointmentItemReadIdRead, ServiceAppointmentItemJsonldServiceAppointmentItemWriteAppointmentItemWrite } from "@api/index";
import { AppointmentEntity, AppointmentsStore, IAppointmentsStore } from "@entities/appointments";
import { ClientsStore, IClientsStore } from "@entities/clients";
import { EmployeeServiceEntity, EmployeeServiceStore, IEmployeeServiceStore } from "@entities/employee-service";
import { GoodEntity, GoodStore, IGoodStore } from "@entities/good";
import { GoodAppointmentItemStore, IGoodAppointmentItemStore, TUpdateAppointmentItemGood } from "@entities/good-appointment-Item";
import { ServiceAppointmentItemStore, TUpdateAppointmentItem } from "@entities/service-appointment-Item";
import { IServiceAppointmentItemStore } from "@entities/service-appointment-Item/types/service-appointment-Item.store.types";
import { IWorkScheduleDaysStore, WorkScheduleDayEntity, WorkScheduleDaysStore } from "@entities/work-schedule-day";
import { LanguageService } from '@i18n/language.service';
import { Helper } from "@lib/helpers/Helper.functions";
import { AppointmentGeneralService } from "@lib/services/appointment";
import { ValidationPopupsService } from '@lib/services/validation';
import { patchState } from "@ngrx/signals";
import { updateEntity } from "@ngrx/signals/entities";
import { TuiTime } from '@taiga-ui/cdk';
import { SuccessInformationPopupService } from '@ui/popups/success-information-popup/success-information-popup.service';
import { TViolations } from '@ui/popups/success-information-popup/violations.types';
import moment, { Moment } from "moment";
import { filter, finalize, take } from "rxjs";
import { IAppointmentDataService, ModifiedGoodAppointmentItemJsonldGoodAppointmentItemWriteAppointmentItemWrite, ModifiedServiceAppointmentItemJsonldServiceAppointmentItemWriteAppointmentItemWrite, TAppoinmentItems, TAppointmentDataForm, TAppointmentDetailClientInfoDataForm, TSelectedService, TUpdateGoodsData, TUpdateServicesData } from "./appointment-data.types";

@Injectable( {
    providedIn: 'root'
} )
export class UpdateCreateAppointmentHelper implements IAppointmentDataService {
    private appointmentStore: IAppointmentsStore = inject( AppointmentsStore );
    private appointmentGeneralService: AppointmentGeneralService = inject( AppointmentGeneralService );
    private workScheduleDaysStore: IWorkScheduleDaysStore = inject( WorkScheduleDaysStore );
    private clientsStore: IClientsStore = inject( ClientsStore );
    private serviceAppointmentItemStore: IServiceAppointmentItemStore = inject( ServiceAppointmentItemStore );
    private goodAppointmentItemStore: IGoodAppointmentItemStore = inject( GoodAppointmentItemStore );
    private goodStore: IGoodStore = inject( GoodStore );
    private employeeServiceStore: IEmployeeServiceStore = inject( EmployeeServiceStore );
    private dataService: IAppointmentDataService | undefined;
    public createUpdateCounter: WritableSignal<number> = signal( 0 );
    readonly successInformationPopupService: SuccessInformationPopupService = inject( SuccessInformationPopupService );
    private _inj: Injector = inject( Injector );
    protected validationPopupsService: ValidationPopupsService = inject( ValidationPopupsService );

    public setDataService( dataService: IAppointmentDataService ): this {
        this.dataService = dataService;
        return this;
    }

    public getForm(): FormGroup<TAppointmentDataForm> {
        if ( !this.dataService ) {
            throw new Error( "Data service not set." );
        }
        return this.dataService.getForm();
    }

    public getClientForm(): FormGroup<TAppointmentDetailClientInfoDataForm> {
        if ( !this.dataService ) {
            throw new Error( "Data service not set." );
        }
        return this.dataService.getClientForm();
    }

    public onSaveEvent(): void {
        let appoinmentId: string | undefined = this.getForm().get( 'id' )?.value;
        this.validationPopupsService.setInvalidForm( this.getForm().controls );

        if ( !appoinmentId ) {
            this.onCreateAppoinmentEvent();
        } else {
            this.onUpdateAppointmentEvent( appoinmentId );
        }
    }

    private formatTuiTime( time: TuiTime | null | undefined ): string {
        if ( !time ) return '';
        return `${time.hours.toString().padStart( 2, '0' )}:${time.minutes.toString().padStart( 2, '0' )}`;
    }

    private awaitUpdateAndLoadDay(): void {
        toObservable( this.createUpdateCounter, { injector: this._inj } ).pipe(
            filter( ( count: number ) => count === 0 ),
            take( 1 )
        ).subscribe( () => {
            this.appointmentStore.loadById( this.getForm().controls.id.value, '1', '1', '1', '1' ).subscribe( ( appointment: AppointmentEntity ) => {
                patchState( this.workScheduleDaysStore, updateEntity( {
                    id: appointment.scheduleDay.id, changes: ( changes ) => {
                        const day: WorkScheduleDayEntity = changes;
                        return {
                            ...day, appointments: ( day.appointments || [] ).concat(
                                {
                                    id: appointment.id,
                                    toTime: appointment.toTime,
                                    fromTime: appointment.fromTime,
                                    "@id": appointment["@id"],
                                    client: { id: appointment.client.id, name: '', phone: '' }
                                }
                            )
                        };
                    }
                } ) );
                this.appointmentGeneralService.onSaveEvent.set( true );
            } );
        } );
    }

    public onUpdateAppointmentEvent( appoinmentId: string ): void {
        this.createUpdateCounter.set( 0 );
        let isPatchAppointmentData: boolean = false;

        let appointment: AppointmentJsonldAppointmentRead = this.appointmentStore.entityMap()[appoinmentId];
        if ( !appointment || !this.validationPopupsService.checkInvalidTextForm( this.getForm().controls, LanguageService.translate( 'appointment_page_front.errors.required' ) ) ) {
            return;
        }

        let oldAppointmentData: AppointmentJsonldAppointmentWriteFromToTimeWrite = {
            client: appointment.client.id || '',
            scheduleDay: appointment.scheduleDay['@id'] || '',
            fromTime: Helper.formatTimeHourAndMinutes( appointment.fromTime ),
            toTime: Helper.formatTimeHourAndMinutes( appointment.toTime ),
            state: appointment.state,
            note: appointment.note || null,
            color: appointment.color || undefined
        };
        const date: Moment = moment( this.getForm().controls.date.value, 'YYYY-MM-DD' );
        let scheduleDay: WorkScheduleDayEntity | undefined = this.workScheduleDaysStore.getDayAsDateByEmployee( date, this.getForm().get( 'employeeId' )?.value || "" );
        if ( !scheduleDay ) {
            return;
        }
        let newAppointmentData: AppointmentJsonldAppointmentWriteFromToTimeWrite = {
            client: this.getClientForm().get( 'id' )?.value || '',
            scheduleDay: scheduleDay['@id'] || '',
            fromTime: this.formatTuiTime( this.getForm().get( 'fromTime' )?.value ),
            toTime: this.formatTuiTime( this.getForm().get( 'toTime' )?.value ),
            state: this.getForm().get( 'state' )?.value,
            note: this.getForm().get( 'comment' )?.value || null,
            color: this.getForm().controls.appointment_color.value || undefined
        };
        if ( JSON.stringify( oldAppointmentData ) !== JSON.stringify( newAppointmentData ) ) {
            let client: ClientJsonldClientRead = this.clientsStore.entityMap()[Helper.getUIDFromAtId( newAppointmentData.client )];
            newAppointmentData.client = client?.['@id'] || '';
            this.createUpdateCounter.set( 1 );
            isPatchAppointmentData = true;
            this.updateAppointmentData( appoinmentId, newAppointmentData );
        }
        let goods: TUpdateGoodsData = {
            adding: [],
            // removed: ( appointment.items || [] )?.filter( ( item: TAppoinmentItems ) => !!item.good?.id ).map( ( item: TAppoinmentItems ) => item.id ),
            removed: [],
            updated: [],
        };
        let services: TUpdateServicesData = {
            adding: [],
            // removed: ( appointment.items || [] )?.filter( ( item: TAppoinmentItems ) => !!item.employeeService?.id ).map( ( item: TAppoinmentItems ) => item.id ),
            removed: [],
            updated: [],
        };

        ( this.getForm().get( 'selected_services' )?.value || [] ).forEach( ( item: TSelectedService ) => {
            let oldItem: TAppoinmentItems | undefined = ( appointment.items || [] )?.find( ( appointmentItem: TAppoinmentItems ) => ( appointmentItem.employeeService?.id || appointmentItem.good?.id ) === item.id );
            let service: EmployeeServiceEntity | undefined = this.employeeServiceStore.entityMap()[item.id];
            let good: GoodEntity | undefined = this.goodStore.entityMap()[item.id];
            let data: ModifiedGoodAppointmentItemJsonldGoodAppointmentItemWriteAppointmentItemWrite | ModifiedServiceAppointmentItemJsonldServiceAppointmentItemWriteAppointmentItemWrite = {
                appointment: appointment['@id'] || '',
                quantity: item.count,
                price: {
                    amount: item.price + '',
                    currency: 'RUB',
                }
            };
            if ( item.discount_percent !== undefined ) {
                data.discountPercent = +item.discount_percent ? +item.discount_percent : null;
            }
            if ( oldItem ) {
                let isChanged: boolean = false;
                if ( data.quantity !== oldItem?.quantity ) {
                    isChanged = true;
                }
                if ( data.price?.amount !== oldItem?.price?.amount ) {
                    isChanged = true;
                }
                if ( ( data?.discountPercent == null ? undefined : data.discountPercent ) !== oldItem?.discountPercent ) {
                    isChanged = true;
                }
                /** пока что отключил удаление и обновление, тк в текущей итерации нужно исправить баг с удаленим сервисов:
                 * При сохранении комментария удаляются услуги из записи и сбрасывается статус. Надо отсылать только измененные поля
                 if ( service ) {
                 services.removed = services.removed.filter( id => id !== item.itemId );
                 isChanged && services.updated.push( {
                 id: oldItem.id,
                 data: { ...data, employeeService: service['@id'] || '' }
                 } );
                 } else {
                 goods.removed = goods.removed.filter( id => id !== item.itemId );

                 isChanged && goods.updated.push( {
                 id: oldItem.id,
                 data: { ...data, good: good['@id'] || '' }
                 } );
                 }
                 **/
            } else {
                if ( service ) {
                    services.adding.push( { ...data, employeeService: service['@id'] || '' } );
                } else {
                    goods.adding.push( { ...data, good: good['@id'] || '' } );
                }
            }
        } );

        let countUpdateItems: number = ( goods.adding.length + goods.updated.length + services.adding.length + services.updated.length + goods.removed.length + services.removed.length );
        this.createUpdateCounter.update( ( value: number ) => value + countUpdateItems );
        this.createAppointmentItemGood( goods.adding ).createAppointmentItemService( services.adding )
            .updateAppointmentItemGood( goods.updated ).updateAppointmentItemService( services.updated )
            .deleteAppointmentItemGood( goods.removed ).deleteAppointmentItemService( services.removed );

        if ( isPatchAppointmentData || !!countUpdateItems ) {
            this.awaitUpdateAndLoadDay();
        } else {
            this.appointmentGeneralService.onSaveEvent.set( true );
        }
    }
    private updateAppointmentData( appointmentId: string, newAppointmentData: AppointmentJsonldAppointmentWriteFromToTimeWrite ): void {
        this.appointmentStore.update( appointmentId, newAppointmentData ).pipe(
            take( 1 ),
            finalize( () => {
                this.createUpdateCounter.update( ( value: number ) => --value );
            } )
        ).subscribe( {
            error: ( error: HttpErrorResponse ) => {
                console.error( 'Error updating appointment:', error );
                const violations: TViolations = error.error?.violations;
                this.validationPopupsService.setViolations( violations );
            },
        } );
    }

    public onCreateAppoinmentEvent(): void {
        const date: string | undefined = this.getForm().get( 'date' )?.value;
        if ( !date ) {
            return;
        }
        let _scheduleDay: WorkScheduleDayEntity | undefined = this.workScheduleDaysStore.getDayAsDateByEmployee( moment( date, 'YYYY-MM-DD' ), this.getForm().get( 'employeeId' )?.value || "" );
        if ( !_scheduleDay || !this.validationPopupsService.checkInvalidTextForm( this.getForm().controls, LanguageService.translate( 'appointment_page_front.errors.required' ) ) ) {
            return;
        }
        let data: AppointmentJsonldAppointmentWriteFromToTimeWrite = {
            client: this.getClientForm().get( 'id' )?.value || '',
            scheduleDay: _scheduleDay['@id'] || '',
            fromTime: Helper.formatTimeHourAndMinutes( this.getForm().get( 'fromTime' )?.value?.toString() || '' ),
            toTime: Helper.formatTimeHourAndMinutes( this.getForm().get( 'toTime' )?.value?.toString() || '' ),
            state: this.getForm().get( 'state' )?.value,
            color: this.getForm().controls.appointment_color.value || null
        };

        this.appointmentStore.create( data, undefined, undefined, undefined, undefined ).pipe( take( 1 ) ).subscribe( {
            next: ( appointment: AppointmentJsonldAppointmentRead ) => {
                let goods: GoodAppointmentItemJsonldGoodAppointmentItemWriteAppointmentItemWrite[] = [];
                let services: ServiceAppointmentItemJsonldServiceAppointmentItemWriteAppointmentItemWrite[] = [];

                ( this.getForm().get( 'selected_services' )?.value || [] ).forEach( ( item: TSelectedService ) => {
                    let data: ModifiedGoodAppointmentItemJsonldGoodAppointmentItemWriteAppointmentItemWrite | ModifiedServiceAppointmentItemJsonldServiceAppointmentItemWriteAppointmentItemWrite = {
                        appointment: appointment['@id'] || '',
                        quantity: item.count,
                        price: {
                            amount: item.price + '',
                            currency: 'RUB',
                        }
                    };
                    if ( item.discount_percent !== undefined ) {
                        data.discountPercent = +item.discount_percent ? +item.discount_percent : null;
                    }
                    let service: EmployeeServiceEntity | undefined = this.employeeServiceStore.entityMap()[item.id];
                    if ( service ) {
                        services.push( { ...data, employeeService: service['@id'] || '' } );
                        return;
                    }

                    let good: GoodEntity | undefined = this.goodStore.entityMap()[item.id];
                    if ( good ) {
                        goods.push( { ...data, good: good['@id'] || '' } );
                        return;
                    }
                } );
                let countUpdateItems: number = goods.length + services.length;
                this.createUpdateCounter.set( countUpdateItems );
                this.createAppointmentItemGood( goods ).createAppointmentItemService( services );
                this.getForm().controls.id.patchValue( appointment.id );

                patchState( this.appointmentStore, { selectedId: appointment.id } );
                this.awaitUpdateAndLoadDay();
            },
            error: ( error: HttpErrorResponse ) => {
                console.error( 'Error creating appointment:', error );
                this.validationPopupsService.setViolations( error?.error?.violations );
            }
        } );
    }

    private createAppointmentItemService( services: ServiceAppointmentItemJsonldServiceAppointmentItemWriteAppointmentItemWrite[] ): this {
        if ( !services.length ) {
            return this;
        }
        services.forEach( ( service: ServiceAppointmentItemJsonldServiceAppointmentItemWriteAppointmentItemWrite ) => {
            this.serviceAppointmentItemStore.create( service ).pipe( take( 1 ) ).subscribe( {
                next: ( resp: ServiceAppointmentItemJsonldServiceAppointmentItemReadAppointmentItemReadIdRead ) => {
                    if ( !this.dataService?.getForm().controls.selected_services.value ) {
                        return;
                    }
                    const serviceId: string | undefined = service.employeeService?.split( '/' ).reverse()[0];
                    let i: number = -1;
                    for ( const serviceForm of this.dataService.getForm().controls.selected_services.value ) {
                        ++i;
                        if ( serviceForm.id === serviceId && !serviceForm.itemId ) {
                            this.dataService.getForm().controls.selected_services.at( i ).patchValue( {
                                itemId: resp.id
                            } );
                            break;
                        }
                    }
                },
                complete: () => {
                    this.createUpdateCounter.update( ( value: number ) => --value );
                },
            } );
        } );
        return this;
    }

    private createAppointmentItemGood( goods: GoodAppointmentItemJsonldGoodAppointmentItemWriteAppointmentItemWrite[] ): this {
        if ( !goods.length ) {
            return this;
        }
        goods.forEach( ( good: GoodAppointmentItemJsonldGoodAppointmentItemWriteAppointmentItemWrite ) => {
            this.goodAppointmentItemStore.create( good ).pipe( take( 1 ) ).subscribe( {
                next: ( resp: GoodAppointmentItemJsonldGoodAppointmentItemReadAppointmentItemReadIdRead ) => {
                    if ( !this.dataService?.getForm().controls.selected_services.value ) {
                        return;
                    }
                    const goodId: string | undefined = good.good?.split( '/' ).reverse()[0];
                    let i: number = -1;
                    for ( const serviceForm of this.dataService.getForm().controls.selected_services.value ) {
                        ++i;
                        if ( serviceForm.id === goodId && !serviceForm.itemId ) {
                            this.dataService.getForm().controls.selected_services.at( i ).patchValue( {
                                itemId: resp.id
                            } );
                            break;
                        }
                    }
                },
                complete: () => {
                    this.createUpdateCounter.update( ( value: number ) => --value );
                },
            } );
        } );
        return this;
    }

    private updateAppointmentItemService( services: TUpdateAppointmentItem[] ): this {
        if ( !services.length ) {
            return this;
        }
        services.forEach( ( service: TUpdateAppointmentItem ) => {
            this.serviceAppointmentItemStore.update( service ).pipe( take( 1 ) ).subscribe( {
                complete: () => {
                    this.createUpdateCounter.update( ( value: number ) => --value );
                },
            } );
        } );
        return this;
    }

    private updateAppointmentItemGood( goods: TUpdateAppointmentItemGood[] ): this {
        if ( !goods.length ) {
            return this;
        }
        goods.forEach( ( good: TUpdateAppointmentItemGood ) => {
            this.goodAppointmentItemStore.update( good ).pipe( take( 1 ) ).subscribe( {
                complete: () => {
                    this.createUpdateCounter.update( ( value: number ) => --value );
                },
            } );
        } );
        return this;
    }

    private deleteAppointmentItemService( services: string[] ): this {
        if ( !services.length ) {
            return this;
        }
        services.forEach( ( service: string ) => {
            this.serviceAppointmentItemStore.delete( service ).pipe( take( 1 ) ).subscribe( {
                complete: () => {
                    this.createUpdateCounter.update( ( value: number ) => --value );
                },
            } );
        } );
        return this;
    }

    private deleteAppointmentItemGood( goods: string[] ): this {
        if ( !goods.length ) {
            return this;
        }
        goods.forEach( ( good: string ) => {
            this.goodAppointmentItemStore.delete( good ).pipe( take( 1 ) ).subscribe( {
                complete: () => {
                    this.createUpdateCounter.update( ( value: number ) => --value );
                },
            } );
        } );
        return this;
    }

    public putClientForm( client: ClientJsonldClientRead ): void {
    }
}
