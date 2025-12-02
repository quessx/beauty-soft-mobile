import { inject, Injectable, Injector } from '@angular/core';
import { combineLatest, filter, first, mergeMap, Observable, of } from 'rxjs';
import { IServiceGroupsStore, ServiceGroupsStore } from '@entities/service-groups';
import { EmployeeServiceStore, IEmployeeServiceStore } from '@entities/employee-service';
import { ActivatedRoute, Router } from '@angular/router';
import { GoodGroupsFilter, GoodGroupsStore, IGoodGroupsStore } from '@entities/good-groups';
import { AppointmentsStore, IAppointmentsStore } from '@entities/appointments';
import { ClientFilter, ClientsStore, IClientsStore } from '@entities/clients';
import { AppointmentJsonldAppointmentRead } from '@api/model/appointmentJsonldAppointmentRead';
import { patchState } from '@ngrx/signals';
import { toObservable } from '@angular/core/rxjs-interop';
import { AppointmentLogRoutesConst } from '@routes/private/appointment-log/appointment-log.routes.const';
import { AppointmentDataService } from '@lib/services/appointment';
import moment from 'moment/moment';
import { Helper } from '@lib/helpers/Helper.functions';

@Injectable( {
    providedIn: 'root'
} )
export class LoadDataService {
    private serviceGroupsStore: IServiceGroupsStore = inject( ServiceGroupsStore );
    private employeeServiceStore: IEmployeeServiceStore = inject( EmployeeServiceStore );
    private router: Router = inject( Router );
    private route: ActivatedRoute = inject( ActivatedRoute );
    private goodGroupsStore: IGoodGroupsStore = inject( GoodGroupsStore );
    private appointmentsStore: IAppointmentsStore = inject( AppointmentsStore );
    private clientsStore: IClientsStore = inject( ClientsStore );
    private _inj: Injector = inject( Injector );

    protected readonly appointmentDataService: AppointmentDataService = inject( AppointmentDataService );

    constructor() {
    }

    loadData( route: ActivatedRoute ): Observable<boolean> {
        if ( route.snapshot.parent?.routeConfig?.path?.includes( AppointmentLogRoutesConst.NewAppointment ) ) {
            return this.loadDataNewAppointment( route );
        } else {
            return this.loadDataAppointment();
        }
    }

    private loadDataNewAppointment( route: ActivatedRoute ): Observable<boolean> {
        this.appointmentDataService.clearForm();
        if ( !this.route.snapshot.parent ) {
            this.router.navigate( [ `../` ] );
            return of( false );
        }
        let employeeId: string = '';
        if ( 'employeeId' in this.route.snapshot.parent.params ) {
            employeeId = this.route.snapshot.parent.params[ 'employeeId' ] + '';
            patchState( this.employeeServiceStore, { selectedId: employeeId, isLoadingById: false } );
            this.appointmentDataService.setEmployeeId( employeeId );
        } else {
            this.router.navigate( [ `../` ] );
            return of( false );
        }

        if ( !this.employeeServiceStore.isEmployeeLoaded() ) {
            this.employeeServiceStore.loadById( employeeId );
        }

        let goodGroupFilter = new GoodGroupsFilter();
        goodGroupFilter.setFilterByName( 'xGoods', '1' );
        patchState( this.goodGroupsStore, { filter: goodGroupFilter } );
        this.appointmentDataService.getForm().patchValue( {
            date: moment( route.snapshot.queryParams[ 'date' ] ).format( 'YYYY-MM-DD' ),
            fromTime: Helper.stringToTuiTime( Helper.formatTimeHourAndMinutes( route.snapshot.queryParams[ 'time_from' ] ) ),
            toTime: Helper.stringToTuiTime( Helper.formatTimeHourAndMinutes( route.snapshot.queryParams[ 'time_to' ] ) ),
        } );

        this.serviceGroupsStore.loadByFilter();
        this.goodGroupsStore.loadByFilter();

        return combineLatest( [
            toObservable( this.employeeServiceStore.isEmployeeLoaded, { injector: this._inj } ),
            toObservable( this.serviceGroupsStore.isLoading, { injector: this._inj } ),
            toObservable( this.goodGroupsStore.isLoading, { injector: this._inj } ),
            toObservable( this.clientsStore.isLoading, { injector: this._inj } ),
        ] ).pipe(
            filter( ( [ isServicesLoaded, isServiceGroupsLoaded, isGoodGroupsLoaded, isClientsLoaded ]: [ boolean, boolean, boolean, boolean ] ) => {
                if ( !isClientsLoaded ) {
                    let clientFilter: ClientFilter = new ClientFilter();
                    clientFilter.setFilterByName( 'itemsPerPage', 10 );
                    patchState( this.clientsStore, { filter: clientFilter } );
                    this.clientsStore.loadByFilter();
                }
                return ( !!isServicesLoaded && !!isServiceGroupsLoaded && !!isGoodGroupsLoaded && !!isClientsLoaded );
            } ),
            first(),
            mergeMap( () => {
                return of( true );
            } )
        );
    }

    private loadDataAppointment(): Observable<boolean> {
        if ( !this.route.snapshot.parent ) {
            this.router.navigate( [ `../` ] );
            return of( false );
        }

        let appointmentId: string = '';
        if ( 'appointmentId' in this.route.snapshot.parent.params ) {
            appointmentId = this.route.snapshot.parent.params[ 'appointmentId' ];
            patchState( this.appointmentsStore, { selectedId: appointmentId } );
        } else {
            this.router.navigate( [ `../` ] );
            return of( false );
        }
        let appointment: AppointmentJsonldAppointmentRead = this.appointmentsStore.entityMap()[ appointmentId ];
        patchState( this.employeeServiceStore, {
            selectedId: appointment?.scheduleDay?.employee?.id,
            isLoadingById: false
        } );

        let clientFilter: ClientFilter = new ClientFilter();
        clientFilter.setFilterByName( 'itemsPerPage', 10 );
        clientFilter.setFilterByName( 'xClientLastAppointment', '1' );
        clientFilter.setFilterByName( 'xAppointmentsCount', '1' );
        clientFilter.setFilterByName( 'xTotalSold', '1' );
        patchState( this.clientsStore, { filter: clientFilter, selectedId: appointment.client.id } );

        let goodGroupFilter = new GoodGroupsFilter();
        goodGroupFilter.setFilterByName( 'xGoods', '1' );
        patchState( this.goodGroupsStore, { filter: goodGroupFilter } );

        return of( true );
    }
}
