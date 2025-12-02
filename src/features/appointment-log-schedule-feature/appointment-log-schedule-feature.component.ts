import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, HostBinding, inject, Injector, Input, Output, Renderer2, signal, TemplateRef, ViewChild, ViewContainerRef, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NgElement, WithProperties } from '@angular/elements';
import { ActivatedRoute, Router } from '@angular/router';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { EventMountArg } from '@fullcalendar/core';
import { Calendar, CalendarOptions, EventClickArg } from '@fullcalendar/core/index.js';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { ResourceApi } from '@fullcalendar/resource/index.js';
import scrollgrid from '@fullcalendar/scrollgrid';
import { registerAE } from '@lib/helpers/base-ae';
import { AppointmentDataService } from '@lib/services/appointment';
import { AppointmentLogScheduletEventModel } from '@lib/types/appointment-log-schedule-event';
import { EmployeeResourceModel } from '@lib/types/employee-resource';
import { CalendateCardComponent } from '@ui/calendate-card';
import { CheckboxPopupService, SelectOptionCheckbox } from '@ui/popups/checkbox-popup';
import { AppintmentLogScheduleBreakCardComponent } from '@ui/schedule/appointment-log-schedule/appintment-log-schedule-break-card';
import { EmployeeHeaderComponent } from '@ui/schedule/employee-header';
import { FilterBtnComponent } from '@ui/schedule/filter';
import { ScheduleMobileHelper } from '@ui/schedule/helpers/ScheduleMobile.helper';
import { LanguageService } from 'beauty-soft-common';
import moment from 'moment';
import { fromEvent, skip, take } from 'rxjs';
import { langData } from './lang';
import { DAY_MIN_WIDTH } from './types/width.const';
import { IUserAccountStore, UserAccountStore } from '@entities/user-account';
import { IOrganizationStore, OrganizationEntity, OrganizationStore } from '@entities/organization';

@Component( {
    selector: 'bsm-appointment-log-schedule-feature',
    imports: [FullCalendarModule, EmployeeHeaderComponent, CalendateCardComponent, AppintmentLogScheduleBreakCardComponent],
    templateUrl: './appointment-log-schedule-feature.component.html',
    styleUrls: ['./appointment-log-schedule-feature.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ScheduleMobileHelper, CheckboxPopupService]
} )
export class AppointmentLogScheduleFeatureComponent implements AfterViewInit {
    private api: Calendar | undefined;
    private _resources: WritableSignal<EmployeeResourceModel[]> = signal( [] );
    private userAccountStore: IUserAccountStore = inject( UserAccountStore );
    private orgStore: IOrganizationStore = inject( OrganizationStore );
    @HostBinding( 'class.is-admin' ) private isAdmin: boolean = this.userAccountStore.isAdmin();
    @Input() set employees( employees: EmployeeResourceModel[] ) {
        this.api?.setOption( 'resources', employees );
        this.calendarOptions.resources = employees;

        this._resources.set( employees );
        this.changeMinMaxTime( employees );

        this.employeesOptions.set(
            employees.map( ( employee: EmployeeResourceModel ) => {
                return { id: employee.id, value: employee.id, label: employee.getFullName(), metadata: { checked: true } };
            } )
        );
    }

    @Input() set initialDate( it: string ) {
        this.calendarOptions.initialDate = it;
        this.api?.gotoDate( it );
    }

    @Input() set events( events: AppointmentLogScheduletEventModel[] ) {
        this.api?.removeAllEvents();
        this.calendarOptions.events = events;
        this.api?.setOption( 'events', events );
    }

    @ViewChild( 'calendar' ) calendarComponent: FullCalendarComponent | undefined;
    @ViewChild( 'calendar', { read: ViewContainerRef } ) calendarVcr: ViewContainerRef | undefined;
    @ViewChild( 'toolbarTemplates' ) toolbarTemplates!: TemplateRef<any>;

    private router: Router = inject( Router );
    private route: ActivatedRoute = inject( ActivatedRoute );
    private renderer: Renderer2 = inject( Renderer2 );
    public appointmentDataService: AppointmentDataService = inject( AppointmentDataService );
    private checkboxPopupService: CheckboxPopupService = inject( CheckboxPopupService );
    private _inj: Injector = inject( Injector );
    private employeesOptions: WritableSignal<SelectOptionCheckbox[]> = signal( [] );

    public calendarOptions: CalendarOptions = {
        schedulerLicenseKey: '',
        initialView: 'resourceTimeGridDay',
        locale: 'ru',
        selectable: false,
        editable: false,
        eventDurationEditable: false,
        timeZone: 'UTC',
        height: '100%',
        plugins: [resourceTimeGridPlugin, scrollgrid],
        resourceOrder: 'original',
        slotDuration: '00:15',
        slotLabelInterval: '01:00',
        dayMinWidth: DAY_MIN_WIDTH,
        slotMinTime: '00:00',
        slotMaxTime: '24:00',
        slotLabelFormat: { hour: '2-digit', hour12: false, },
        datesAboveResources: false,
        selectOverlap: true,
        allDaySlot: false,
        resources: [],
        eventClick: this.onEventClick.bind( this ),
        eventDidMount: ( arg: EventMountArg ) => {
            this.renderer.setAttribute( arg.el, 'range', arg.timeText );
        },
        eventsSet: () => {
            requestAnimationFrame( () => {
                this.scheduleMobileHelper.setRows();
            } );
        },
        resourcesSet: ( args: ResourceApi[] ) => {
            const els: Element[] = Array.from( this.calendarComponent?.getApi().el.querySelectorAll( 'td.fc-day.fc-timegrid-col.fc-resource[data-resource-id]' ) || [] );
            for ( const td of els ) {
                td.removeAttribute( 'fromTime' );
                td.removeAttribute( 'toTime' );
            }
            args.forEach( ( arg: ResourceApi, index: number ) => {
                if ( arg.extendedProps['fromTime'] ) {
                    this.renderer.setAttribute( els[index], 'fromTime', arg.extendedProps['fromTime'] );
                    this.renderer.setAttribute( els[index], 'toTime', arg.extendedProps['toTime'] );
                }
            } );
            requestAnimationFrame( () => {
                this.scheduleMobileHelper.setRows();
                this.scheduleMobileHelper.setScroll();
            } );
        },
    };

    private destroyRef: DestroyRef = inject( DestroyRef );
    public scheduleMobileHelper: ScheduleMobileHelper = inject( ScheduleMobileHelper );

    constructor() {
        LanguageService.setLangData( langData[LanguageService.getLangStatic()] );
    }

    ngAfterViewInit(): void {
        this.api = this.calendarComponent?.getApi();
        if ( !this.api ) {
            return;
        }
        const calendar: HTMLElement | undefined = this.api.el;
        if ( !calendar ) {
            return;
        }

        this.scheduleMobileHelper.init( this.calendarComponent, this.calendarOptions, this.isAdmin );
        this.setFilter();
    }

    private setFilter(): void {
        if ( !this.isAdmin ) {
            return;
        }
        registerAE( 'filter-btn-ae', FilterBtnComponent, this._inj );
        const filter: NgElement & WithProperties<{ active: boolean; }> = this.renderer.createElement( 'filter-btn-ae' );
        const parent: Element | null | undefined = this.calendarComponent?.getApi().el.querySelector( '.fc-scroller-harness' );
        if ( !parent ) {
            return;
        }

        fromEvent( filter, 'click' ).pipe( takeUntilDestroyed( this.destroyRef ) ).subscribe( () => {
            toObservable( this.employeesOptions, { injector: this._inj } ).pipe( takeUntilDestroyed( this.destroyRef ), skip( 1 ), take( 1 ) ).subscribe( ( v: SelectOptionCheckbox[] ) => {
                const res: EmployeeResourceModel[] = this.calendarOptions.resources = this._resources()
                    .filter( ( e: EmployeeResourceModel ) => {
                        return v.find( ( opt: SelectOptionCheckbox ) => opt.id === e.id && opt.metadata?.checked );
                    } );

                filter.active = this._resources().length !== res.length;

                this.calendarComponent?.getApi().batchRendering( () => {
                    this.changeMinMaxTime( res );
                    this.calendarComponent?.getApi().setOption( 'resources', res );
                } );
            } );

            this.checkboxPopupService.show(
                this.employeesOptions,
                LanguageService.translate( 'appointment_page_front.checkbox_popup.center_text' ),
                LanguageService.translate( 'appointment_page_front.checkbox_popup.entities_title' )
            );
        } );

        this.renderer.appendChild( parent, filter );
    }

    private changeMinMaxTime( employees: EmployeeResourceModel[] ) {
        const org: OrganizationEntity | undefined = this.orgStore.getSelectedOrganization();

        const filtered: EmployeeResourceModel[] = employees.filter( ( e: EmployeeResourceModel ) => !!e.fromTime || e.toTime );
        let min: string;
        let max: string;
        if ( !!filtered.length ) {
            min = moment.min( filtered.map( ( e: EmployeeResourceModel ) => moment( e.fromTime, 'HH:mm:ss' ) ) ).format( 'HH' ) + ':00';
            max = moment.max( filtered.map( ( e: EmployeeResourceModel ) => moment( e.toTime, 'HH:mm:ss' ) ) ).format( 'HH:mm' );
        } else {
            min = org?.fromTime?.slice( 0, 5 ) || '00:00';
            max = org?.toTime?.slice( 0, 5 ) || '24:00';
        }

        this.calendarOptions.slotMinTime = min;
        this.calendarOptions.slotMaxTime = max;
        this.api?.setOption( 'slotMinTime', min );
        this.api?.setOption( 'slotMaxTime', max );
    }

    public onEventClick( info: EventClickArg ): void {
        if ( info.event.extendedProps?.['type'] === 'break' ) {
            return;
        }
        this.router.navigate( [`./appointment/${info.event.id}`], {
            relativeTo: this.route,
            queryParamsHandling: 'merge'
        } );
    }
}
