import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { PositionsTableItem } from '@entities/speciality';
import { SpecialistPopupTypesClass } from '@ui/popups/specialist-popup';
import { SpecialistCoordinatorService } from './specialist-coordinator.service';

@Injectable()
export class SpecialistService {
    private coordinatorService: SpecialistCoordinatorService = inject( SpecialistCoordinatorService );

    public selectOption: WritableSignal<string> = signal( '' );
    public optionsSignal: WritableSignal<PositionsTableItem[]> = signal( [] );
    public searchTerm: WritableSignal<string> = signal( '' );
    public texts: WritableSignal<SpecialistPopupTypesClass> = signal( new SpecialistPopupTypesClass() );

    public onSpecialistEvent(): void {
        // Регистрируем этот экземпляр как активный
        this.coordinatorService.registerActiveSpecialist(
            this.selectOption,
            this.optionsSignal,
            this.searchTerm,
            this.texts,
            ( value: string ) => this.selectOption.set( value ),
            ( value: string ) => this.searchTerm.set( value )
        );
        this.coordinatorService.onSpecialistEvent();
    }

    public onSpecialistCancelEvent(): void {
        this.coordinatorService.onSpecialistCancelEvent();
    }
}
