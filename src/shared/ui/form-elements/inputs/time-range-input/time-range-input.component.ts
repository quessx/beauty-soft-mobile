import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { FormGroup, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiTime } from '@taiga-ui/cdk';
import { Subscription } from 'rxjs';
import { TimeRangeValue, TimeRangeValueTui } from './index';
import { VectorIconComponent } from '@icons/vector-icon';
import { RightColumnLineComponent } from '@ui/templates/right-column-line';

@Component( {
    selector: 'bsm-time-range-input',
    standalone: true,
    imports: [ CommonModule, VectorIconComponent, RightColumnLineComponent ],
    templateUrl: './time-range-input.component.html',
    styleUrls: [ './time-range-input.component.scss' ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef( () => TimeRangeInputComponent ),
            multi: true
        }
    ]
} )
export class TimeRangeInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() public formGroup?: FormGroup;
    @Input() public startTimeControlName: string = 'fromTime';
    @Input() public endTimeControlName: string = 'toTime';
    @Input() public disabled: boolean = false;
    @Input() public placeholder: string = '';
    /** Minutes step for native time input (converted to seconds for step attr) */
    @Input() public stepMinutes: number = 5;
    /** Enforce start <= end by auto-adjusting end time */
    @Input() public enforceOrder: boolean = true;

    @Output() public timeChange = new EventEmitter<TimeRangeValue>();

    private subscription?: Subscription;

    // Internal state when компонент используется как ControlValueAccessor без внешнего formGroup
    private _start: TuiTime | null = null;
    private _end: TuiTime | null = null;

    // CVA callbacks
    private onChange: ( value: TimeRangeValue | null ) => void = () => {
    };
    private onTouched: () => void = () => {
    };

    public get startTimeControl(): FormControl | null {
        if ( !this.formGroup ) {
            return null;
        }
        const control: FormControl | null = this.formGroup.get( this.startTimeControlName ) as FormControl | null;
        return control;
    }

    public get endTimeControl(): FormControl | null {
        if ( !this.formGroup ) {
            return null;
        }
        const control: FormControl | null = this.formGroup.get( this.endTimeControlName ) as FormControl | null;
        return control;
    }

    public get startTimeValue(): string {
        const tuiTime: TuiTime | null = this.formGroup ? this.getStartTimeFromControl() : this._start;
        return tuiTime ? this.tuiTimeToString( tuiTime ) : '';
    }

    public get endTimeValue(): string {
        const tuiTime: TuiTime | null = this.formGroup ? this.getEndTimeFromControl() : this._end;
        return tuiTime ? this.tuiTimeToString( tuiTime ) : '';
    }

    private getStartTimeFromControl(): TuiTime | null {
        const control: FormControl | null = this.startTimeControl;
        if ( !control ) {
            return null;
        }
        return control.value || null;
    }

    private getEndTimeFromControl(): TuiTime | null {
        const control: FormControl | null = this.endTimeControl;
        if ( !control ) {
            return null;
        }
        return control.value || null;
    }

    private tuiTimeToString( tuiTime: TuiTime ): string {
        if ( !tuiTime ) {
            return '';
        }
        return `${ tuiTime.hours.toString().padStart( 2, '0' ) }:${ tuiTime.minutes.toString().padStart( 2, '0' ) }`;
    }

    private stringToTuiTime( timeString: string ): TuiTime | null {
        if ( !timeString ) {
            return null;
        }
        const parts: string[] = timeString.split( ':' );
        const hours: number = Number( parts[ 0 ] );
        const minutes: number = Number( parts[ 1 ] );
        if ( Number.isNaN( hours ) || Number.isNaN( minutes ) ) {
            return null;
        }
        return new TuiTime( hours, minutes );
    }

    private minutesOf( t: TuiTime | null ): number | null {
        if ( t === null ) {
            return null;
        }
        return t.hours * 60 + t.minutes;
    }

    private ensureOrder(): void {
        if ( !this.enforceOrder ) {
            return;
        }
        const start: TuiTime | null = this.formGroup ? this.getStartTimeFromControl() : this._start;
        const end: TuiTime | null = this.formGroup ? this.getEndTimeFromControl() : this._end;
        if ( !start || !end ) {
            return;
        }
        const startMinutes: number | null = this.minutesOf( start );
        const endMinutes: number | null = this.minutesOf( end );
        if ( startMinutes === null || endMinutes === null ) {
            return;
        }
        if ( startMinutes <= endMinutes ) {
            return;
        }

        const add: number = this.stepMinutes;
        let minutesTotal: number = startMinutes + add;
        if ( minutesTotal >= 24 * 60 ) {
            minutesTotal = startMinutes;
        }
        const h: number = Math.floor( minutesTotal / 60 );
        const m: number = minutesTotal % 60;

        if ( this.formGroup ) {
            const endControl: FormControl | null = this.endTimeControl;
            if ( endControl ) {
                endControl.setValue( new TuiTime( h, m ), { emitEvent: false } );
            }
        } else {
            this._end = new TuiTime( h, m );
        }
    }

    public onStartTimeChange( event: Event ): void {
        const target: HTMLInputElement | null = this.getInputTarget( event );
        if ( !target ) {
            return;
        }
        const tuiTime: TuiTime | null = this.stringToTuiTime( target.value );
        if ( this.formGroup ) {
            const startControl: FormControl | null = this.startTimeControl;
            if ( startControl ) {
                startControl.setValue( tuiTime );
                startControl.markAsDirty();
                startControl.markAsTouched();
            }
        } else {
            this._start = tuiTime;
        }
        this.ensureOrder();
        this.emitChange();
        this.onTouched();
    }

    public onEndTimeChange( event: Event ): void {
        const target: HTMLInputElement | null = this.getInputTarget( event );
        if ( !target ) {
            return;
        }
        const tuiTime: TuiTime | null = this.stringToTuiTime( target.value );
        if ( this.formGroup ) {
            const endControl: FormControl | null = this.endTimeControl;
            if ( endControl ) {
                endControl.setValue( tuiTime );
                endControl.markAsDirty();
                endControl.markAsTouched();
            }
        } else {
            this._end = tuiTime;
        }
        this.ensureOrder();
        this.emitChange();
        this.onTouched();
    }

    private getInputTarget( event: Event ): HTMLInputElement | null {
        const target: EventTarget | null = event.target;
        if ( !target ) {
            return null;
        }
        return target as HTMLInputElement;
    }

    public onStartTimeClick( event: Event ): void {
        const target: HTMLInputElement | null = this.getInputTarget( event );
        if ( !target ) {
            return;
        }
        target.focus();
        if ( target.showPicker ) {
            target.showPicker();
        }
    }

    public onEndTimeClick( event: Event ): void {
        const target: HTMLInputElement | null = this.getInputTarget( event );
        if ( !target ) {
            return;
        }
        target.focus();
        if ( target.showPicker ) {
            target.showPicker();
        }
    }

    private emitChange(): void {
        const payload: TimeRangeValue = { startTime: this.startTimeValue, endTime: this.endTimeValue };
        this.timeChange.emit( payload );
        if ( !this.formGroup ) {
            this.onChange( payload );
        }
    }

    public get stepAttr(): number {
        return Math.max( 60, this.stepMinutes * 60 );
    }

    public ngOnInit(): void {
        if ( this.formGroup ) {
            this.subscription = this.formGroup.valueChanges.subscribe( () => this.ensureOrder() );
        }
    }

    public ngOnDestroy(): void {
        if ( this.subscription ) {
            this.subscription.unsubscribe();
        }
    }

    public writeValue( obj: TimeRangeValueTui | null ): void {
        if ( this.formGroup ) {
            return;
        }
        if ( !obj ) {
            this._start = null;
            this._end = null;
            return;
        }

        const s: TuiTime | string | null | undefined = obj.startTime ?? obj.fromTime;
        const e: TuiTime | string | null | undefined = obj.endTime ?? obj.toTime;
        this._start = typeof s === 'string' ? this.stringToTuiTime( s ) : ( s || null );
        this._end = typeof e === 'string' ? this.stringToTuiTime( e ) : ( e || null );
    }

    public registerOnChange( fn: ( value: TimeRangeValue | null ) => void ): void {
        this.onChange = fn;
    }

    public registerOnTouched( fn: () => void ): void {
        this.onTouched = fn;
    }

    public setDisabledState( isDisabled: boolean ): void {
        this.disabled = isDisabled;
    }
}
