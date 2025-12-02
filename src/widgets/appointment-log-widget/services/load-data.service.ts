import { inject, Injectable, Injector } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { EmployeesStore, IEmployeesStore } from "@entities/employees";
import { ISpecialityStore, SpecialityFilter, SpecialityStore } from "@entities/speciality";
import { IUserAccountStore, UserAccountStore } from "@entities/user-account";
import { AppointmentLogDataService, AppointmentLogLoadService } from "@lib/services/appointment-log";
import { ValidationPopupsService } from "@lib/services/validation";
import { patchState } from "@ngrx/signals";
import moment from "moment";
import { combineLatest, filter, map, Observable, take, tap } from "rxjs";

@Injectable()
export class LoadDataService {
    private employeesStore: IEmployeesStore = inject( EmployeesStore );
    private specialityStore: ISpecialityStore = inject( SpecialityStore );
    private appointmentLogLoadService = inject( AppointmentLogLoadService );
    private appointmentLogDataService = inject( AppointmentLogDataService );
    private validationPopupsService = inject( ValidationPopupsService );
    private _inj: Injector = inject( Injector );
    private route: ActivatedRoute = inject( ActivatedRoute );
    private userAccountStore: IUserAccountStore = inject( UserAccountStore );

    constructor() { }

    loadData(): Observable<boolean> {
        this.validationPopupsService.clearErrors();

        patchState( this.specialityStore, {
            filter: new SpecialityFilter(
                {
                    page: undefined,
                    itemsPerPage: undefined,
                    pagination: false
                }
            ), selectedId: ''
        } );

        patchState( this.employeesStore, { isLoading: false } );
        this.employeesStore.loadByFilter();
        this.specialityStore.loadByFilter();

        return combineLatest( [
            toObservable( this.employeesStore.isLoading, { injector: this._inj } ).pipe(
                tap( ( isLoaded: boolean ) => {
                    if ( isLoaded ) {
                        const [year, month, day] = moment().format( 'YYYY-MM-DD' ).split( '-' ).map( ( it: string ) => Number( it ) );
                        if ( !this.userAccountStore.isAdmin() && ( screen.orientation.type === 'landscape-primary' || screen.orientation.type === 'landscape-secondary' ) ) {
                            this.appointmentLogDataService.scheduleState.set( 'week' );
                        }
                        this.appointmentLogDataService.selectedDate.set( { year, month: month - 1, day } );
                    }
                } )
            ),
            toObservable( this.specialityStore.isLoading, { injector: this._inj } ),
            toObservable( this.appointmentLogLoadService.getIsLoading(), { injector: this._inj } ),
        ] ).pipe(
            filter( ( [isEmployeesLoaded, isSpecialityLoaded, isAppointmentLogLoadService]: [boolean, boolean, boolean] ) => {
                return ( isEmployeesLoaded && isSpecialityLoaded && isAppointmentLogLoadService );
            } ),
            take( 1 ),
            map( () => true )
        );
    }

}
