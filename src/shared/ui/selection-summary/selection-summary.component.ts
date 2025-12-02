import { ChangeDetectionStrategy, Component, computed, HostListener, inject, input, output, InputSignal, OutputEmitterRef, Signal } from '@angular/core';
import { CloseIconComponent } from '@icons/close-icon';
import { InputComponent, TInputTypeIcons } from '@ui/form-elements';
import { AppointmentDataService } from '@lib/services/appointment';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectionAggregate } from '@features/add-order-feature';
import { TextComponent } from '@ui/text';
import { TemplateLineComponent } from '@ui/templates/template-line';
import { LeftColumnForLineComponent } from '@ui/templates/left-column-for-line';
import { RightColumnLineComponent } from '@ui/templates/right-column-line';
import { TemplateLeftColumnCardComponent } from '@ui/templates/template-left-column-card';
import { RubleIconComponent } from '@icons/ruble-icon';
import { SpaceDigitsPipe } from '@lib/pipes/space-digits';
import { AppointmentEntity, AppointmentsStore, IAppointmentsStore } from '@entities/appointments';

@Component ( {
    selector: 'bsm-add-order-selection-summary',
    imports: [RubleIconComponent, CloseIconComponent, SpaceDigitsPipe, InputComponent, ReactiveFormsModule, TextComponent, TemplateLineComponent, LeftColumnForLineComponent, RightColumnLineComponent, TemplateLeftColumnCardComponent],
    templateUrl: './selection-summary.component.html',
    styleUrl: './selection-summary.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class SelectionSummaryComponent {
    protected readonly inputTypePriceIcons: TInputTypeIcons = { isNeedRubIcon: true, adaptiveWidth: true };
    protected readonly inputTypePercentIcons: TInputTypeIcons = { isPercentIcon: true, type: 'percent' };
    protected readonly appointmentDataService: AppointmentDataService = inject ( AppointmentDataService );
    private readonly appointmentsStore: IAppointmentsStore = inject( AppointmentsStore );

    // Input signals - современный подход для входных данных
    public readonly aggregate: InputSignal<SelectionAggregate> = input.required<SelectionAggregate> ( );

    // Output function - современный подход для событий
    public readonly remove: OutputEmitterRef<string> = output<string> ( );

    public readonly hasItems: Signal<boolean> = computed ( (): boolean => {
        // Добавляем зависимость от версии для реактивности
        this.appointmentDataService.selectedServicesVersion();
        return this.appointmentDataService.selectedServices.length > 0;
    } );

    public readonly totalAmount: Signal<number> = computed ( (): number => {
        const agg: SelectionAggregate = this.aggregate ( );
        return agg.serviceTotal + agg.goodsTotal;
    } );

    public constructor ( ) {
    }
    public isPaidSignal: Signal<boolean> = computed( () => {
        return this.getCurrentAppointment()?.paid || false;
    } );

    private getCurrentAppointment(): AppointmentEntity | undefined {
        return this.appointmentsStore.entityMap()[ this.appointmentDataService.getForm().controls.id.value ];
    }
    public onRemove ( event: Event, id?: string ): void {
        if ( !id ) {
            return;
        }
        event.stopPropagation ( );
        this.remove.emit ( id );
    }

    @HostListener ( 'click', ['$event'] )
    public onClick ( $event: Event ): void {
        $event.stopPropagation ( );
        $event.preventDefault ( );
    }
}
