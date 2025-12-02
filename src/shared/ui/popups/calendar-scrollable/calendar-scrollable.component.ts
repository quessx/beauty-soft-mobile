import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, HostBinding, Injector, Input, OnInit, output, OutputEmitterRef, Renderer2, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AppointmentLogComponentTypes } from '@lib/services/appointment-log';
import { ActionsWrapperComponent } from '@ui/wrappers/actions-wrapper';
import { LanguageService, TranslatePipe } from 'beauty-soft-common';
import { skip } from 'rxjs';
import { langData } from './lang';
import { TCalendarDate } from './types';
import { CalendarComponent } from './ui/calendar.component';

@Component( {
    selector: 'bsm-calendar-scrollable',
    imports: [TranslatePipe, CalendarComponent, ActionsWrapperComponent],
    templateUrl: './calendar-scrollable.component.html',
    styleUrl: './calendar-scrollable.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class CalendarScrollableComponent implements AfterViewInit, OnInit {
    public closeModal: OutputEmitterRef<void> = output();
    public currentYear: number = new Date().getFullYear();
    public years: number[] = Array.from( { length: 3 }, ( _, i: number ) => this.currentYear - 0 + i );
    public months: number[] = Array.from( { length: 12 }, ( _, i: number ) => i );
    @Input() public selectedDate?: WritableSignal<TCalendarDate | null>;
    @Input() public weekDate: TCalendarDate | null = null;
    protected _selectedDate: WritableSignal<TCalendarDate | null> = signal( null );
    @Input() public calendarType?: WritableSignal<AppointmentLogComponentTypes.scheduleState | null>;
    protected _calendarType: AppointmentLogComponentTypes.scheduleState | null = 'day';
    private tabMenu: Signal<ElementRef<HTMLDivElement> | undefined> = viewChild( 'tabMenu' );
    @HostBinding( 'class.select-full-week' ) private fullWeek: boolean = false;

    constructor(
        private ren: Renderer2,
        private _inj: Injector,
        private destroyRef: DestroyRef,
        private elementRef: ElementRef<HTMLElement>,
    ) {
        LanguageService.setLangData( langData[LanguageService.getLangStatic()] );
    }

    ngAfterViewInit(): void {
        if ( !this.selectedDate || !this.selectedDate() ) {
            return;
        }

        this._selectedDate.set( this.weekDate ? this.weekDate : this.selectedDate() );
        const year: string | undefined = this._selectedDate()?.year.toString();
        const month: string | undefined = this._selectedDate()?.month.toString();
        if ( !year || !month ) {
            return;
        }

        this.elementRef.nativeElement.querySelector( `div[cont] > div[scrollable] > div[year="${year}"][month="${month}"]` )?.scrollIntoView();

        toObservable( this._selectedDate, { injector: this._inj } ).pipe( takeUntilDestroyed( this.destroyRef ), skip( 1 ) ).subscribe( () => {
            this.selectedDate?.set( this._selectedDate() );
            this.calendarType?.set( this._calendarType );
            this.closeModal.emit();
        } );
    }

    ngOnInit(): void {
        this.onClick( this.calendarType?.call( this ) || AppointmentLogComponentTypes.scheduleState.day );
    }

    protected onCancel(): void {
        this.closeModal.emit();
    }

    protected onClick( type: AppointmentLogComponentTypes.scheduleState ): void {
        const el: Element | null | undefined = this.tabMenu()?.nativeElement.querySelector( `[${type}]` );
        this.tabMenu()?.nativeElement.childNodes.forEach( ( el: ChildNode ) => this.ren.removeClass( el, 'selected' ) );
        this.ren.addClass( el, 'selected' );
        this._calendarType = type;
        this.fullWeek = type === 'week';
    }
}
