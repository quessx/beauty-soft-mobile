import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, HostListener, inject, Input, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppointmentAppointmentRead } from '@api/model/appointmentAppointmentRead';
import { VisitStateButtonComponent } from '@ui/buttons/visit-state-button';
import { VisitStateBlockPopupService } from '@ui/popups/visit-state-block-popup/visit-state-block-popup.service';

@Component({
    selector: 'bsm-visit-state-block',
    imports: [VisitStateButtonComponent],
    templateUrl: './visit-state-block.component.html',
    styleUrl: './visit-state-block.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VisitStateBlockComponent),
            multi: true
        }
    ],
})
export class VisitStateBlockComponent implements ControlValueAccessor {
    private visitStateBlockPopupService: VisitStateBlockPopupService = inject(VisitStateBlockPopupService);
    private elementRef: ElementRef = inject(ElementRef);

    @Input() states: AppointmentAppointmentRead.StateEnum[] = [];

    selectedState: WritableSignal<AppointmentAppointmentRead.StateEnum> = signal('waiting');

    value: AppointmentAppointmentRead.StateEnum | undefined = undefined;

    private onChange: Function = (value: AppointmentAppointmentRead.StateEnum) => {
    };

    writeValue(value: AppointmentAppointmentRead.StateEnum): void {
        this.selectedState.set(value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState?(isDisabled: boolean): void {
    }

    onClick(state: AppointmentAppointmentRead.StateEnum): void {
        this.selectedState.set(state);
        this.onChange(state);
    }

    @HostListener('click') OnClickBlock(): void {
        let stateEnums = Object.assign(AppointmentAppointmentRead.StateEnum);
        delete stateEnums.Cancelled;

        const coords: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();
        this.visitStateBlockPopupService
            .show(this.elementRef, {
                states: Object.values(stateEnums),
                selected: this.value
            }, undefined, 'top', '', coords)
            .setOnChangeEvent((result: AppointmentAppointmentRead.StateEnum) => {
                if (result) {
                    this.selectedState.set(result);
                    this.onChange(result);
                }
            });
    }
}
