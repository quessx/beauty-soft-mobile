import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PositionsTableItem } from '@entities/speciality';
import { SpecialistPopupTypesClass } from '@ui/popups/specialist-popup';

/**
 * Глобальный сервис-координатор для управления событиями специалиста
 * Используется для коммуникации между компонентами на уровне приложения
 */
@Injectable( {
    providedIn: 'root'
} )
export class SpecialistCoordinatorService {
    private specialistSubject: Subject<undefined> = new Subject<undefined>();
    private specialistOnCancelSubject: Subject<undefined> = new Subject<undefined>();

    // Данные активного SpecialistService для работы popup
    public activeSelectOption: WritableSignal<string> = signal( '' );
    public activeOptionsSignal: WritableSignal<PositionsTableItem[]> = signal( [] );
    public activeSearchTerm: WritableSignal<string> = signal( '' );
    public activeTexts: WritableSignal<SpecialistPopupTypesClass> = signal( new SpecialistPopupTypesClass() );

    // Callback для синхронизации данных обратно к активному компоненту
    private onSelectCallback: ( ( value: string ) => void ) | null = null;
    private onSearchCallback: ( ( value: string ) => void ) | null = null;

    public onSpecialistEvent(): void {
        this.specialistSubject.next( undefined );
    }

    public onSpecialistCancelEvent(): void {
        this.specialistOnCancelSubject.next( undefined );
    }

    public getSpecialistSubjectAsObservable(): Observable<undefined> {
        return this.specialistSubject.asObservable();
    }

    public getSpecialistOnCancelSubjectAsObservable(): Observable<undefined> {
        return this.specialistOnCancelSubject.asObservable();
    }

    /**
     * Регистрирует активный компонент specialist и его данные
     */
    public registerActiveSpecialist(
        selectOption: WritableSignal<string>,
        optionsSignal: WritableSignal<PositionsTableItem[]>,
        searchTerm: WritableSignal<string>,
        texts: WritableSignal<SpecialistPopupTypesClass>,
        onSelect: ( value: string ) => void,
        onSearch: ( value: string ) => void
    ): void {
        this.activeSelectOption = selectOption;
        this.activeOptionsSignal = optionsSignal;
        this.activeSearchTerm = searchTerm;
        this.activeTexts = texts;
        this.onSelectCallback = onSelect;
        this.onSearchCallback = onSearch;
    }

    /**
     * Уведомляет активный компонент об изменении выбранного значения
     */
    public notifySelectChange( value: string ): void {
        if ( this.onSelectCallback ) {
            this.onSelectCallback( value );
        }
    }

    /**
     * Уведомляет активный компонент об изменении поискового запроса
     */
    public notifySearchChange( value: string ): void {
        if ( this.onSearchCallback ) {
            this.onSearchCallback( value );
        }
    }
}
