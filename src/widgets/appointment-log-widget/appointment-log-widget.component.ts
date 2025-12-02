import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { AppointmentsStore, IAppointmentsStore } from '@entities/appointments';
import { ClientsStore, IClientsStore } from '@entities/clients';
import { EmployeesStore, IEmployeesStore } from '@entities/employees';
import { ISpecialityStore, SpecialityStore } from '@entities/speciality';
import { IWorkScheduleDaysStore, WorkScheduleDaysStore } from '@entities/work-schedule-day';
import { AppointmentLogScheduleFeatureComponent } from '@features/appointment-log-schedule-feature';
import { AppointmentLogScheduleWeekFeatureComponent } from '@features/appointment-log-schedule-week-feature';
import { BaseWidget } from '@lib/helpers/base-widget/base-widget.class';
import { AppointmentDataService } from '@lib/services/appointment';
import { AppointmentLogComponentTypes, AppointmentLogDataService, AppointmentLogLoadService } from '@lib/services/appointment-log';
import { DefaultOverlayComponent } from '@lib/services/default-overlay';
import { CalendarScrollableService, TCalendarDate } from '@ui/popups/calendar-scrollable';
import { LanguageService } from 'beauty-soft-common';
import moment, { Moment } from 'moment';
import { debounceTime, fromEvent, Observable, Subject } from 'rxjs';
import { DayAppointmentLogHelper } from './helpers/DayAppointmentLog.helper';
import { WeekAppointmentLogHelper } from './helpers/WeekAppointmentLog.helper';
import { langData } from './lang';
import { LoadDataService } from './services/load-data.service';
import { IUserAccountStore, UserAccountStore } from '@entities/user-account';

@Component( {
    selector: 'bsm-appointment-log-widget',
    imports: [AppointmentLogScheduleFeatureComponent, RouterOutlet, AppointmentLogScheduleWeekFeatureComponent, DefaultOverlayComponent],
    templateUrl: './appointment-log-widget.component.html',
    styleUrl: './appointment-log-widget.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [LoadDataService]
} )
export class AppointmentLogWidgetComponent extends BaseWidget {
    private loadDataService: LoadDataService = inject( LoadDataService );
    public employeesStore: IEmployeesStore = inject( EmployeesStore );
    public specialityStore: ISpecialityStore = inject( SpecialityStore );
    public workScheduleDaysStore: IWorkScheduleDaysStore = inject( WorkScheduleDaysStore );
    public appointmentsStore: IAppointmentsStore = inject( AppointmentsStore );
    public date: WritableSignal<string> = signal( moment().format( 'YYYY-MM-DD' ) );
    public clientsStore: IClientsStore = inject( ClientsStore );
    public appointmentLogLoadService: AppointmentLogLoadService = inject( AppointmentLogLoadService );
    public dayAppointmentLogHelper: DayAppointmentLogHelper = new DayAppointmentLogHelper( this );
    public weekAppointmentLogHelper: WeekAppointmentLogHelper = new WeekAppointmentLogHelper( this );
    public appointmentDataService: AppointmentDataService = inject( AppointmentDataService );
    public appointmentLogDataService: AppointmentLogDataService = inject( AppointmentLogDataService );
    private calendarService: CalendarScrollableService = inject( CalendarScrollableService );
    private userAccountStore: IUserAccountStore = inject( UserAccountStore );
    private changeWeekdayTrigger: Subject<Date> = new Subject;
    protected stateDay: AppointmentLogComponentTypes.scheduleState = AppointmentLogComponentTypes.scheduleState.day;
    protected stateWeek: AppointmentLogComponentTypes.scheduleState = AppointmentLogComponentTypes.scheduleState.week;

    constructor() {
        super();
        LanguageService.setLangData( langData[LanguageService.getLangStatic()] );

        toObservable( this.appointmentLogDataService.selectedDate ).pipe( takeUntilDestroyed() ).subscribe( ( selectedDate: TCalendarDate | null ) => {
            if ( !selectedDate ) {
                return;
            }
            if ( this.appointmentLogDataService.scheduleState() === this.stateDay ) {
                this.date.set( moment( selectedDate ).format( 'YYYY-MM-DD' ) );
                this.appointmentLogLoadService.loadDayData( moment( selectedDate ) );
            }

            if ( !!this.employeesStore.selectedId() && this.appointmentLogDataService.scheduleState() === this.stateWeek ) {
                const start: Moment = moment( selectedDate ).startOf( 'isoWeek' ).subtract( 1, 'months' );
                const end: Moment = moment( selectedDate ).startOf( 'isoWeek' ).add( 2, 'months' );
                this.appointmentLogLoadService.loadRangeData( start.clone(), end );
                this.date.set( start.format( 'YYYY-MM-DD' ) );
            }

            this.calendarService.weekDate.set( null );
        } );

        this.changeWeekdayTrigger.pipe( takeUntilDestroyed(), debounceTime( 10 ) ).subscribe( ( date: Date ) => {
            const start: Moment = moment( date );
            const end: Moment = moment( date ).add( 3, 'months' );
            this.appointmentLogLoadService.loadRangeData( start, end );
        } );

        if ( !this.userAccountStore.isAdmin() ) {
            const onOrientation: Function = () => {
                if ( screen.orientation.type === 'landscape-primary' || screen.orientation.type === 'landscape-secondary' ) {
                    this.appointmentLogDataService.scheduleState.set( this.stateWeek );
                } else {
                    this.appointmentLogDataService.scheduleState.set( this.stateDay );
                }
                const clone: TCalendarDate | null = structuredClone( this.appointmentLogDataService.selectedDate() );
                this.appointmentLogDataService.selectedDate.set( clone );
            };

            fromEvent( screen.orientation, 'change' ).pipe( takeUntilDestroyed() ).subscribe( () => {
                onOrientation();
            } );
        }
    }

    onChangeWeekday( date: Date ): void {
        this.changeWeekdayTrigger.next( date );
    }

    onScrolledWeeks( [week, date]: [number, Date] ): void {
        const currentWeek: Moment = moment( date ).add( week, 'months' );
        this.calendarService.weekDate.set( { year: currentWeek.year(), month: currentWeek.month(), day: currentWeek.date() } );
    }

    override preload(): Observable<boolean> {
        return this.loadDataService.loadData();
    }
}
