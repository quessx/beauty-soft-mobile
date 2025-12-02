import { ChangeDetectorRef, DestroyRef, ElementRef, inject, Injectable, Injector, Renderer2 } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NgElement, WithProperties } from "@angular/elements";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeesStore, IEmployeesStore } from "@entities/employees";
import { DAY_ACTIVE_WIDTH, DAY_MIN_WIDTH } from "@features/appointment-log-schedule-feature/types/width.const";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { Calendar, CalendarOptions } from "@fullcalendar/core";
import { registerAE } from "@lib/helpers/base-ae";
import { AppointmentLogDataService, AppointmentLogLoadService } from "@lib/services/appointment-log";
import { patchState } from "@ngrx/signals";
import { Base } from "@plugins/base";
import { TCalendarDate } from "@ui/popups/calendar-scrollable";
import { NextDayProgressComponent } from "@ui/schedule/next-day-progress";
import moment, { Duration, Moment } from "moment";
import { auditTime, filter, fromEvent, interval, map, Observable, switchMap, take, takeUntil } from "rxjs";
import { LensService } from "../lens";
import { ScheduleMobileScroll } from "./ScheduleMobileScroll.class";

@Injectable()
export class ScheduleMobileHelper {
    protected expandedColWidth: number = 177;
    protected colWidth: number = 140;
    private calendarApi: Calendar | undefined;
    private calendarEl: HTMLElement | undefined;
    private calendarOptions: CalendarOptions | undefined;
    private lensService: LensService = inject( LensService );
    private scheduleMobileScroll: ScheduleMobileScroll | undefined;
    private employeeStore: IEmployeesStore = inject( EmployeesStore );
    private IS_ADMIN: boolean = false;

    constructor(
        protected destroyRef: DestroyRef,
        protected ren: Renderer2,
        private elementRef: ElementRef<HTMLElement>,
        protected appointmentLogDataService: AppointmentLogDataService,
        private appointmentLogLoadService: AppointmentLogLoadService,
        protected cdr: ChangeDetectorRef,
        protected router: Router,
        protected route: ActivatedRoute,
        protected _inj: Injector
    ) {
    }

    public init( calendar: FullCalendarComponent | undefined, options: CalendarOptions, isAdmin: boolean ): void {
        this.calendarApi = calendar?.getApi();
        this.calendarEl = this.calendarApi?.el;
        this.calendarOptions = options;
        this.IS_ADMIN = isAdmin;
        if ( !this.calendarApi || !this.calendarEl ) {
            return;
        }

        // this.setSwipeDownNextDay( this.calendarEl );
        // this.setSwipeUpReload( this.calendarEl );
        this.setFocusLens( this.calendarEl );
        this.setScroll();
    }

    private getBodyWidth(): number {
        return innerWidth - 69; // 69 = ширина сайдбара
    }

    public setScroll(): void {
        if ( !this.calendarEl ) {
            return;
        }
        const headers: NodeListOf<HTMLElement> = this.calendarEl.querySelectorAll( '.fc-scrollgrid .fc-scroller' );
        if ( !headers ) {
            return;
        }
        let activeWidth: number = DAY_ACTIVE_WIDTH;
        let colWidth: number = DAY_MIN_WIDTH;
        if (!this.IS_ADMIN) {
            const bodyWidth: number = this.getBodyWidth();
            activeWidth = colWidth = bodyWidth - 22;
        }
        if ( this.scheduleMobileScroll ) {
            try {
                this.scheduleMobileScroll.updateSizes();
            } catch (e) {
                this.scheduleMobileScroll?.destroy();
                this.scheduleMobileScroll = new ScheduleMobileScroll( headers, this.lensService, this.employeeStore, activeWidth, colWidth, this.IS_ADMIN );
            }
        } else {
            this.scheduleMobileScroll = new ScheduleMobileScroll( headers, this.lensService, this.employeeStore, activeWidth, colWidth, this.IS_ADMIN );
        }
        this.appendSpacersToScrollContainers();
    }

    private setFocusLens( calendar: HTMLElement ): void {
        let activeWidth: number = DAY_ACTIVE_WIDTH;
        let colWidth: number = DAY_MIN_WIDTH;
        if (!this.IS_ADMIN) {
            const bodyWidth: number = this.getBodyWidth();
            activeWidth = colWidth = bodyWidth - 22;
        }
        const focusBlock: HTMLDivElement = this.ren.createElement( 'bsm-lens-ae' );
        this.ren.setAttribute( focusBlock, 'ref-width', (activeWidth - 2) + '' );
        this.ren.setAttribute( focusBlock, 'default-column-width', colWidth + '' );
        this.ren.addClass( focusBlock, 'focus' );
        this.ren.appendChild( calendar, focusBlock );
    }

    protected setSwipeDownNextDay( calendar: HTMLElement ): void {
        const scroller: Element | null = calendar.querySelector( '.fc-scrollgrid.fc-scrollgrid-liquid .fc-scroller.fc-scroller-liquid-absolute:has(.fc-timegrid-body)' );
        registerAE( 'bsm-next-day-progress', NextDayProgressComponent, this._inj );
        const nextDayProgressEl: NgElement & WithProperties<{ progress: number, day: Moment | null, resetProgress: any; }> = this.ren.createElement( 'bsm-next-day-progress' );
        this.ren.appendChild( this.elementRef.nativeElement, nextDayProgressEl );
        const nextDay: Moment = moment( this.calendarApi?.getDate() || new Date );
        nextDayProgressEl.day = nextDay.add( 1, 'd' );
        if ( !scroller ) {
            return;
        }
        scroller.scrollTo( { top: 0 } );
        const isTouchEvent: ( ev: Event ) => ev is TouchEvent = {} = ( ev: Event ) => ev instanceof TouchEvent;

        fromEvent( scroller, 'touchstart', { passive: true } ).pipe(
            takeUntilDestroyed( this.destroyRef ),
            filter( () => Math.abs( scroller.scrollTop - ( scroller.scrollHeight - scroller.clientHeight ) ) < 1 ),
            filter( isTouchEvent ),
            switchMap( ( touchstart: TouchEvent ) => {
                const nextDay: Moment = moment( this.calendarApi?.getDate() || new Date );
                nextDayProgressEl.day = nextDay.add( 1, 'd' );
                // Переносим переменную внутрь обработчика для изоляции между жестами
                let touchMovedUpAfterScrollend: boolean = false;
                const touchEndFromEvent: Observable<TouchEvent> = fromEvent( document.body, 'touchend', { passive: true } ).pipe(
                    filter( isTouchEvent ),
                    take( 1 )
                );

                // Обработка движений пальца
                fromEvent( scroller, 'touchmove' )
                    .pipe(
                        takeUntilDestroyed( this.destroyRef ),
                        takeUntil( touchEndFromEvent ),
                        filter( isTouchEvent )
                    )
                    .subscribe( ( ev: TouchEvent ) => {
                        const start: Touch | null = touchstart.changedTouches.item( 0 );
                        const move: Touch | null = ev.targetTouches.item( 0 );
                        if ( !start || !move || touchMovedUpAfterScrollend ) {
                            return;
                        }
                        if ( move.clientY > start.clientY ) {
                            touchMovedUpAfterScrollend = true;
                            return;
                        }

                        const distance: number = Math.min( start.clientY - move.clientY, 150 );
                        this.ren.setStyle( this.elementRef.nativeElement.firstElementChild, 'transform', `translateY(${-distance}px)` );

                        if ( distance > 75 ) {
                            nextDayProgressEl.progress = ( distance - 75 ) / 75;
                        }
                    } );

                return touchEndFromEvent.pipe(
                    map( ( touchend: TouchEvent ) => {
                        const start: Touch | null = touchstart.changedTouches.item( 0 );
                        const end: Touch | null = touchend.changedTouches.item( 0 );
                        if ( !start || !end ) {
                            return { distance: 0, movedUp: touchMovedUpAfterScrollend };
                        }
                        return {
                            distance: start.clientY - end.clientY,
                            movedUp: touchMovedUpAfterScrollend
                        };
                    } )
                );
            } )
        ).subscribe( ( result: { distance: number, movedUp: boolean; } ) => {
            const { distance, movedUp } = result;

            if ( distance > 150 ) {
                let date: TCalendarDate | null | Moment = this.appointmentLogDataService.selectedDate();
                if ( !date || movedUp ) {
                    return;
                }

                this.elementRef.nativeElement.firstElementChild?.animate( [{
                    transform: 'translateY(-100%)',
                    opacity: 0
                }
                ], {
                    duration: 150, fill: 'none'
                } ).finished.finally( () => {
                    this.ren.setStyle( this.elementRef.nativeElement.firstElementChild, 'transform', 'translateY(100%)' );
                    this.elementRef.nativeElement.firstElementChild?.animate( [
                        { transform: 'translateY(0)' }
                    ], {
                        duration: 150, fill: 'none'
                    } ).finished.finally( () => {
                        this.ren.removeStyle( this.elementRef.nativeElement.firstElementChild, 'transform' );
                    } );
                } );

                date = moment( date ).add( 1, 'd' );
                this.appointmentLogDataService.selectedDate.set( { day: date.date(), month: date.month(), year: date.year() } );
            } else {
                this.elementRef.nativeElement.firstElementChild?.animate( [
                    { transform: 'translateY(0)' }
                ], { duration: 100, fill: 'none' } ).finished.finally( () => {
                    this.ren.removeStyle( this.elementRef.nativeElement.firstElementChild, 'transform' );
                } );
            }

            if ( distance > 75 ) { // TODO
                const start: number = ( distance - 75 ) / 75;
                interval( 1 ).pipe(
                    takeUntilDestroyed( this.destroyRef ),
                    take( distance - 75 + 1 )
                ).subscribe( ( v: number ) => {
                    const progress: number = start * ( 1 - v / ( distance - 75 ) );
                    nextDayProgressEl.progress = progress;
                } );
            }
        } );
    }

    protected setSwipeUpReload( calendar: HTMLElement ): void {
        const scroller: Element | null = calendar.querySelector( '.fc-scrollgrid.fc-scrollgrid-liquid .fc-scroller.fc-scroller-liquid-absolute:has(.fc-timegrid-body)' );
        if ( !scroller ) {
            return;
        }

        const _filter: ( ev: Event ) => ev is TouchEvent = ( ev: Event ) => ev instanceof TouchEvent;
        fromEvent( scroller, 'touchstart', { passive: true } ).pipe(
            takeUntilDestroyed( this.destroyRef ),
            filter( () => !scroller.scrollTop ),
            filter( _filter )
        ).subscribe( ( ev: TouchEvent ) => {
            const y: number = ev.targetTouches.item( 0 )?.clientY || 0;
            fromEvent( document.body, 'touchmove', { passive: true } ).pipe(
                auditTime( 20 ),
                takeUntilDestroyed( this.destroyRef ),
                takeUntil( fromEvent( document.body, 'touchend' ) ),
                filter( _filter ),
                filter( ( ev: TouchEvent ) => {
                    return ( ev.targetTouches.item( 0 )?.clientY || 0 ) - y > 150;
                } ),
                take( 1 )
            ).subscribe( () => {
                this.appointmentLogLoadService.showLoadingOverlay.set( true );
                let date: TCalendarDate | null | Moment = this.appointmentLogDataService.selectedDate();
                date = moment( date );
                this.appointmentLogDataService.selectedDate.set( { day: date.date(), month: date.month(), year: date.year() } );
            } );
        } );
    }

    public setRows(): void {
        if ( !this.calendarEl || !this.calendarOptions ) {
            return;
        }
        const _start: Moment = moment( this.calendarOptions.slotMinTime, 'HH:mm' );
        const start: number = ( _start.hours() * 60 + _start.minutes() ) / 15;
        const _end: Moment = moment( this.calendarOptions.slotMaxTime, 'HH:mm' );
        const end: number = this.calendarOptions.slotMaxTime === '24:00' ? 95 : ( _end.hours() * 60 + _end.minutes() ) / 15 - 1;
        const frames: NodeListOf<Element> = this.calendarEl.querySelectorAll( '.fc-timegrid-col-frame' );
        if ( !frames ) {
            return;
        }

        frames.forEach( ( frame: Element ) => {
            let fullyBlocked: boolean = false;
            frame.querySelector( '.border-rows-cont' )?.remove();
            const td: Element | null = frame.closest( '.fc-day' );
            let from: string | null | undefined | number = td?.getAttribute( 'fromtime' );
            let to: string | null | undefined | number = td?.getAttribute( 'totime' );

            if ( !!to && !!from ) {
                const _from: Moment = moment( from, 'HH:mm:ss' );
                from = _from.hours() * 60 / 15 + _from.minutes() / 15;
                const _to: Moment = moment( to, 'HH:mm:ss' );
                to = _to.hours() * 60 / 15 + _to.minutes() / 15;
            }
            if ( !to && !from ) {
                fullyBlocked = true;
            }
            
            const cont: HTMLDivElement = this.ren.createElement( 'div' );
            this.ren.addClass( cont, 'border-rows-cont' );
            for ( let i: number = start; i <= end; i++ ) {
                const row: HTMLDivElement = this.ren.createElement( 'div' );
                if ( from == null || typeof from === 'number' && typeof to === 'number' && ( i < from || i >= to ) ) {
                    this.ren.addClass( row, 'blocked' );
                } else {
                    let mins: number = i * 15;
                    this.ren.setAttribute( row, 'from_time', Math.trunc( mins / 60 ).toString().padStart( 2, '0' ) + ':' + ( mins % 60 || '00' ) );
                    mins += 15;
                    this.ren.setAttribute( row, 'to_time', Math.trunc( mins / 60 ).toString().padStart( 2, '0' ) + ':' + ( mins % 60 || '00' ) );
                }

                this.ren.appendChild( cont, row );
            }
            this.ren.appendChild( frame, cont );

            this.ren.setStyle( cont, 'z-index', '1' );
            this.ren.setStyle( cont, 'position', 'relative' );
            if ( !fullyBlocked ) {
                fromEvent( cont, 'click' ).subscribe( ( ev ) => {
                    if ( !( ev.target instanceof HTMLElement ) ) {
                        return;
                    }

                    const resourceId: string | null | undefined = frame.parentElement?.getAttribute( 'data-resource-id' );
                    const fromTime: string | null = ev.target.getAttribute( 'from_time' );
                    const toTime: string | null = ev.target.getAttribute( 'to_time' );
                    const date: string | null | undefined = frame.parentElement?.getAttribute( 'data-date' );
                    if ( !fromTime || !resourceId || !toTime || !date ) {
                        return;
                    }

                    this.router.navigate( [`./new-appointment/${resourceId}`], {
                        relativeTo: this.route,
                        queryParamsHandling: 'merge',
                        queryParams: {
                            date: date,
                            time_to: toTime,
                            time_from: fromTime
                        }
                    } );
                } );
            }
        } );
    }

    private appendSpacersToScrollContainers(): void {
        if ( !this.calendarEl ) {
            return;
        }

        const scrollContainers: NodeListOf<HTMLElement> = this.calendarEl.querySelectorAll( '.fc-scrollgrid .fc-scroller' );
        scrollContainers.forEach( ( container: HTMLElement ) => {
            if ( container.querySelector( '.spacer' ) || container.querySelector('.fc-timegrid-axis-chunk') ) {
                return; // Skip if spacer or axis chunk already exists
            }

            if (container.querySelector('.fc-timegrid-body')) {
                container = container.querySelector('.fc-timegrid-body') as HTMLElement;
            }

            const spacer: HTMLSpanElement = this.ren.createElement( 'span' );
            this.ren.addClass( spacer, 'spacer' );
            this.ren.appendChild( container, spacer );
        } );
    }
}
