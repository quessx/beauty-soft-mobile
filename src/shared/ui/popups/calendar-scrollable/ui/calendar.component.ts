import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, HostListener, Input, input, InputSignalWithTransform, OnInit, Renderer2, RendererStyleFlags2, Signal, viewChild, WritableSignal } from '@angular/core';
import { langData } from '@ui/popups/calendar-scrollable';
import { LanguageService } from 'beauty-soft-common';
import moment, { Moment } from 'moment';
import { TCalendarData, TCalendarDate } from '../types';

@Component( {
    selector: 'bsm-calendar',
    imports: [],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class CalendarComponent implements OnInit, AfterViewInit {
    public date: InputSignalWithTransform<moment.Moment, TCalendarData> = input.required( {
        transform: ( data: TCalendarData ) => moment( { year: data.year, month: data.month } )
    } );
    private dates: Signal<ElementRef | undefined> = viewChild( 'dates' );
    public daysShort: string[];
    @Input() public selectedDate?: WritableSignal<TCalendarDate | null>;

    constructor( private ren: Renderer2, private elementRef: ElementRef<HTMLElement> ) {
        if ( typeof langData.ru['calendar'] == 'object' && typeof langData.ru['calendar']['week'] == 'object' ) {
            this.daysShort = Object.keys( langData.ru['calendar']['week'] ).map( ( key ) => LanguageService.translate( 'calendar.week.' + key ) );
        } else {
            throw new Error( 'week is not a obj' );
        }

        effect( () => {
            if ( !this.selectedDate ) {
                return;
            }
            const selectedDate: TCalendarDate | null = this.selectedDate();
            if ( !selectedDate ) {
                return;
            }

            const selected: NodeListOf<Element> = this.elementRef.nativeElement.querySelectorAll( 'div[dates] > div.week > div.selected' );
            selected.forEach( ( el: Element ) => this.ren.removeClass( el, 'selected' ) );

            if ( this.selectedDate()?.year === this.date().year() && this.selectedDate()?.month === this.date().month() ) {
                const day: Element = this.elementRef.nativeElement.querySelectorAll( '.clickable' )[selectedDate.day - 1];
                !!day && this.ren.addClass( day, 'selected' );
            }
        } );
    }

    ngOnInit(): void {
        const now: Moment = moment();
        let isCurrentMonth: boolean = false;
        if ( now.year() === this.date().year() && now.month() === this.date().month() ) {
            isCurrentMonth = true;
        }

        const fragment: DocumentFragment = document.createDocumentFragment();
        const startMonthWeekDay: number = this.date().isoWeekday();
        const daysInMonth: number = this.date().daysInMonth();
        let weeks: number = Math.ceil( ( daysInMonth + startMonthWeekDay - 1 ) / 7 );
        let passedDay: number = 1;

        for ( let indexWeek: number = 1; indexWeek <= weeks; indexWeek++ ) {
            const week: HTMLDivElement = this.ren.createElement( 'div' );
            this.ren.addClass( week, 'week' );
            for ( let index: number = 1; index <= 7; index++ ) {
                const day: HTMLDivElement = this.ren.createElement( 'div' );
                if ( ( startMonthWeekDay === index || passedDay > 1 ) && passedDay <= daysInMonth ) {
                    const text: Text = this.ren.createText( `${passedDay}` );
                    this.ren.appendChild( day, text );
                    this.ren.addClass( day, 'clickable' );

                    if ( isCurrentMonth && passedDay === now.date() ) {
                        this.ren.addClass( day, 'now' );
                    }

                    ++passedDay;
                }

                this.ren.appendChild( week, day );
            }
            this.ren.appendChild( fragment, week );
        }

        !!this.dates()?.nativeElement && this.ren.appendChild( this.dates()?.nativeElement, fragment );
    }

    ngAfterViewInit(): void {
        this.weekSelector();
    }

    @HostListener( 'click', ['$event'] ) onHostClick( ev: PointerEvent ): void {
        if ( !( ev.target instanceof HTMLDivElement ) || !ev.target.classList.contains( 'clickable' ) ) {
            return;
        }
        const date = { year: this.date().year(), month: this.date().month(), day: Number( ev.target.textContent ) };
        this.selectedDate?.set( date );
    }

    private weekSelector(): void {
        const transformSelectorBlock: Function = ( week: Element | null ) => {
            if ( !week ) {
                return;
            }
            const clickables: NodeListOf<Element> = week.querySelectorAll( '.clickable' );
            if ( !clickables.length ) {
                return;
            }

            const first: DOMRect = clickables[0].getBoundingClientRect();
            const last: DOMRect = clickables[clickables.length - 1].getBoundingClientRect();
            this.ren.setStyle( week, '--left', first.x - first.width + 8 + 'px', RendererStyleFlags2.Important );
            this.ren.setStyle( week, '--width', last.x - first.x + first.width + 'px', RendererStyleFlags2.Important );
        };

        const week: Element | null = this.elementRef.nativeElement.querySelector( 'div[dates] div.week:has(div.clickable.selected)' );
        if ( !this.elementRef.nativeElement.querySelector( 'div[dates] div.week > div.selected' ) ) {
            this.boundedWeekSelector( transformSelectorBlock );
        }
        transformSelectorBlock( week );
    }

    private boundedWeekSelector( transformSelectorBlock: Function ): void {
        const temp: TCalendarDate | null | undefined = this.selectedDate?.asReadonly()();
        if ( !temp ) {
            return;
        }
        const selected: Moment = moment( { year: temp.year, month: temp.month, day: temp.day } );
        const endWeek: Moment = selected.clone().endOf( 'isoWeek' );
        const startWeek: Moment = selected.clone().startOf( 'isoWeek' );
        if ( endWeek.month() === this.date().month() && endWeek.year() === this.date().year() ) {
            const boundedWeek: Element | null = this.elementRef.nativeElement.querySelector( 'div[dates] div.week:first-child' );
            transformSelectorBlock( boundedWeek );
            this.ren.addClass( boundedWeek, 'bounded' );
        }
        if ( startWeek.month() === this.date().month() && startWeek.year() === this.date().year() ) {
            const boundedWeek: Element | null = this.elementRef.nativeElement.querySelector( 'div[dates] div.week:last-child' );
            transformSelectorBlock( boundedWeek );
            this.ren.addClass( boundedWeek, 'bounded' );
        }
    }
}
