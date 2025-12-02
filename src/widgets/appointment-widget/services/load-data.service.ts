import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentEntity, AppointmentsStore, IAppointmentsStore } from '@entities/appointments';
import { ClientEntity, ClientIdFilter, ClientsStore, IClientsStore } from '@entities/clients';
import { Helper } from '@lib/helpers/Helper.functions';
import { AppointmentDataService, TAppoinmentItems } from '@lib/services/appointment';
import { TuiTime } from '@taiga-ui/cdk';
import moment from 'moment';
import { exhaustMap, Observable, of, Subscriber } from 'rxjs';

@Injectable()
export class LoadDataService {
    private route: ActivatedRoute = inject( ActivatedRoute );
    private appointmentDataService: AppointmentDataService = inject( AppointmentDataService );
    private appointmentsStore: IAppointmentsStore = inject( AppointmentsStore );
    private clientsStore: IClientsStore = inject( ClientsStore );
    private router: Router = inject( Router );

    private patchForm( clientEntity: ClientEntity, appointmentEntity: AppointmentEntity ): void {
        const stringToTuiTime: Function = ( timeStr: string ): TuiTime => {
            const [ hours, minutes ] = timeStr.split( ':' ).map( Number );
            return new TuiTime( hours, minutes );
        };

        this.appointmentDataService.getForm().patchValue( {
            id: appointmentEntity.id,
            employeeId: appointmentEntity.scheduleDay.employee.id,
            state: appointmentEntity.state,
            date: moment( appointmentEntity.scheduleDay.day ).format( 'YYYY-MM-DD' ),
            fromTime: stringToTuiTime( Helper.formatTimeHourAndMinutes( appointmentEntity.fromTime ) ),
            toTime: stringToTuiTime( Helper.formatTimeHourAndMinutes( appointmentEntity.toTime ) ),
            comment: appointmentEntity?.note || '',
            selected_service_ids: ( appointmentEntity.items || [] ).map( ( item: TAppoinmentItems ) => ( item?.employeeService?.id || item.good?.id || '' ) ),
            selected_services: [],
        } );

        this.appointmentDataService.selectedServices.clear();

        ( appointmentEntity.items || [] ).forEach( ( item: TAppoinmentItems ) => {
            const common = {
                id: item.good?.id || item.employeeService?.id || '',
                count: item.quantity || 1,
                price: item.price || { amount: '0', currency: 'USD' },
                discount_percent: item.discountPercent || 0,
            };

            if ( item.good?.id ) {
                this.appointmentDataService.addGood( {
                    ...common,
                    name: item.good.name || '',
                    itemId: item.id
                } );
            } else if ( item.employeeService?.id ) {
                this.appointmentDataService.addService( {
                    ...common,
                    service: item.employeeService.service,
                    employeeId: '',
                    itemId: item.id
                } );
            }
        } );

        this.appointmentDataService.getClientForm().patchValue( {
            id: clientEntity.id,
            name: clientEntity.id,
            phone: clientEntity.id,
            email: clientEntity.email || '',
            note: clientEntity.comment || ''
        } );
    }

    private navigateBack(): void {
        this.router.navigate( [ '../' ] );
        this.appointmentDataService.getForm().reset();
        this.appointmentDataService.getClientForm().reset();
    }

    private loadClientIfNotLoaded( appointmentEntity: AppointmentEntity ): Observable<boolean> {
        const clientId: string = appointmentEntity.client.id;
        const clientEntity: ClientEntity = this.clientsStore.entityMap()[ clientId ];

        if ( clientEntity ) {
            this.patchForm( clientEntity, appointmentEntity );
            return of( true );
        } else {
            return new Observable( ( subscriber: Subscriber<boolean> ) => {
                this.clientsStore.loadByIdAsObservable( {
                    id: clientId,
                    filter: new ClientIdFilter
                } ).subscribe( () => {
                    subscriber.next( true );
                    subscriber.complete();
                    this.patchForm( this.clientsStore.entityMap()[ clientId ], appointmentEntity );
                } );
            } );
        }
    }

    loadData(): Observable<boolean> {
        this.appointmentDataService.clearForm();

        let employeeId: string | null = this.route.snapshot.paramMap.get( 'employeeId' );
        if ( employeeId ) {
            return of( true );
        }

        let appointmentId: string | null = this.route.snapshot.paramMap.get( 'appointmentId' );
        if ( !appointmentId ) {
            this.navigateBack();
            return of( false );
        }

        let appointmentEntity: AppointmentEntity = this.appointmentsStore.entityMap()[ appointmentId ];
        if ( !appointmentEntity ) {
            return this.appointmentsStore.loadById( appointmentId, '1', '1', '1', '1' ).pipe(
                exhaustMap( () => {
                    appointmentEntity = this.appointmentsStore.entityMap()[ appointmentId ];
                    return this.loadClientIfNotLoaded( appointmentEntity );
                } )
            );
        } else {
            return this.loadClientIfNotLoaded( appointmentEntity );
        }
    }
}
