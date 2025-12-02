import { DestroyRef, EventEmitter, inject, Injectable, Renderer2 } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DAY_ACTIVE_WIDTH_WEEK, DAY_MIN_WIDTH_WEEK } from "@features/appointment-log-schedule-week-feature/types/width.const";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { Calendar, CalendarOptions } from "@fullcalendar/core";
import moment, { Duration, Moment } from "moment";
import { auditTime, fromEvent, Observable } from "rxjs";
import { LensService } from "../lens";
import { ScheduleMobileScroll } from "./ScheduleMobileScroll.class";
import { EmployeesStore, IEmployeesStore } from "@entities/employees";

@Injectable()
export class ScheduleMobileWeekHelper {
    private calendarEl?: HTMLElement;
    private calendarApi?: Calendar;
    private calendarOptions?: CalendarOptions;
    public dayWidth: number = DAY_MIN_WIDTH_WEEK;
    private lensService: LensService = inject( LensService );
    private scheduleMobileScroll: ScheduleMobileScroll | undefined;
    private employeeStore: IEmployeesStore = inject( EmployeesStore );
    private readonly columns: number = 30;
    private changeWeekday: EventEmitter<Date> | null = null;
    private scrolledWeeks: EventEmitter<[number, Date]> | null = null;

    constructor(private ren: Renderer2, private destroyRef: DestroyRef) {

    }

    public init(calendar: FullCalendarComponent | undefined, options: CalendarOptions ): void {
        this.calendarApi = calendar?.getApi();
        this.calendarEl = this.calendarApi?.el;
        this.calendarOptions = options;
        if (!this.calendarApi || !this.calendarEl || !this.calendarOptions) {
            return;
        }

        this.setFocusLens(this.calendarEl);
        this.onChangeOrientation();
        this.setScroll();
    }

    public setScroll(): void {
        if ( !this.calendarEl ) {
            return;
        }
        const headers: NodeListOf<HTMLElement> = this.calendarEl.querySelectorAll( '.fc-scrollgrid .fc-scroller' );
        if ( !headers ) {
            return;
        }
        let activeWidth: number = DAY_ACTIVE_WIDTH_WEEK;
        let colWidth: number = DAY_MIN_WIDTH_WEEK;
        this.scheduleMobileScroll?.destroy();
        this.scheduleMobileScroll = new ScheduleMobileScroll( headers, this.lensService, this.employeeStore, activeWidth, colWidth, true, true );
        this.subscribeToScrollEvents();
    }

    public setRows(): void {
        if (!this.calendarEl || !this.calendarOptions) {
            return;
        }
        const _start: Moment = moment(this.calendarOptions.slotMinTime, 'HH:mm');
        const start: number = (_start.hours() * 60 + _start.minutes()) / 15;
        const _end: Moment = moment(this.calendarOptions.slotMaxTime, 'HH:mm');
        const end: number = this.calendarOptions.slotMaxTime === '24:00' ? 95 : (_end.hours() * 60 + _end.minutes()) / 15 - 1;
        const frames: NodeListOf<Element> = this.calendarEl.querySelectorAll('.fc-timegrid-col-frame');
        if (!frames) {
            return;
        }

        frames.forEach((frame: Element) => {
            frame.querySelector('.border-rows-cont')?.remove();
            const td: Element | null = frame.closest('.fc-day');
            let from: string | null | undefined | number = td?.getAttribute('fromtime');
            let to: string | null | undefined | number = td?.getAttribute('totime');
            const cont: HTMLDivElement = this.ren.createElement('div');
            this.ren.addClass(cont, 'border-rows-cont');
            for (let i: number = start; i <= end; i++) {
                const row: HTMLDivElement = this.ren.createElement('div');
                if (from == null || typeof from === 'number' && typeof to === 'number' && (i < from || i >= to)) {
                    this.ren.addClass(row, 'blocked');
                }

                this.ren.appendChild(cont, row);
            }
            this.ren.appendChild(frame, cont);
        });
    }

    private setFocusLens(calendar: HTMLElement): void {
        let activeWidth: number = DAY_ACTIVE_WIDTH_WEEK;
        let colWidth: number = DAY_MIN_WIDTH_WEEK;
        const focusBlock: HTMLDivElement = this.ren.createElement( 'bsm-lens-ae' );
        this.ren.setAttribute( focusBlock, 'ref-width', (activeWidth - 2) + '' );
        this.ren.setAttribute( focusBlock, 'default-column-width', colWidth + '' );
        this.ren.addClass( focusBlock, 'focus' );
        this.ren.appendChild( calendar, focusBlock );
    }

    private onChangeOrientation(): void {
        const scrollerEl: Element | null | undefined = this.calendarEl?.querySelector('tbody td:last-child .fc-scroller.fc-scroller-liquid-absolute');
        fromEvent(screen.orientation, 'change').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            if (screen.orientation.type === 'landscape-primary' || screen.orientation.type === 'landscape-secondary') {
                this.calendarApi?.setOption('dayMinWidth', 177);
                this.dayWidth = 177;
            } else {
                this.calendarApi?.setOption('dayMinWidth', 96);
                this.dayWidth = 96;
            }
            scrollerEl?.scrollTo({ left: this.dayWidth * 14 });
        });
    }

    public setChangeWeekdayEmitter(emitter: EventEmitter<Date>): void {
        this.changeWeekday = emitter;
    }

    public setScrolledWeeksEmitter(emitter: EventEmitter<[number, Date]>): void {
        this.scrolledWeeks = emitter;
    }

    public subscribeToScrollEvents(): void {
        const scrollerEl: Element | null | undefined = this.calendarEl?.querySelector( 'tbody td:last-child .fc-scroller.fc-scroller-liquid-absolute' );
        
        this.scheduleMobileScroll?.getBScrollInstance()?.scrollTo( -(DAY_MIN_WIDTH_WEEK * this.columns), 0 , 0 );
        this.scheduleMobileScroll?.getScrollSubject().pipe(takeUntilDestroyed(this.destroyRef), auditTime( 20 )).subscribe((pos: { x: number; y: number }) => {
            if ( !scrollerEl || !this.calendarApi ) {
                return;
            }
            
            if ( pos.x + DAY_MIN_WIDTH_WEEK * this.columns >= scrollerEl.scrollWidth - 1 ) {
                this.scheduleMobileScroll?.updateActiveIndex(-1);
                this.calendarApi?.incrementDate( { month: 1 } );
                this.changeWeekday?.emit( this.calendarApi?.getDate() );
                this.scheduleMobileScroll?.getBScrollInstance()?.scrollTo( -DAY_MIN_WIDTH_WEEK, -pos.y , 0 );
            } else if ( pos.x === 0 ) {
                this.scheduleMobileScroll?.updateActiveIndex(-1);
                this.calendarApi?.incrementDate( { month: -1 } );
                this.scheduleMobileScroll?.getBScrollInstance()?.scrollTo( -(DAY_MIN_WIDTH_WEEK * this.columns), -pos.y , 0 );
                this.changeWeekday?.emit( this.calendarApi?.getDate() );
            }
            this.scrolledWeeks?.emit( [Math.floor( pos.x / DAY_MIN_WIDTH_WEEK / this.columns ), this.calendarApi.getDate()] );
        });
    }
}