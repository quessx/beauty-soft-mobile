import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, forwardRef, HostListener, inject, Input, input, InputSignal, OnInit, output, OutputEmitterRef, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SpecialistPopupService } from '@ui/popups/specialist-popup/services/specialist-popup.service';
import { PositionsTableItem } from '@entities/speciality';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, pairwise } from 'rxjs';
import { SpecialistPopupTypesClass } from '@ui/popups/specialist-popup';
import { LanguageService, TranslatePipe } from 'beauty-soft-common';
import { langData } from './lang';
import { TextComponent } from '@ui/text';
import { DefaultAvatarIconComponent } from '@icons/default-avatar-icon/default-avatar-icon.component';
import { RightColumnLineComponent } from '@ui/templates/right-column-line';
import { NgTemplateOutlet } from '@angular/common';
import { MoleculeMasterComponent } from '@ui/molecules/molecule-master';
import { AppointmentGeneralService } from '@lib/services/appointment';
import { SpecialistService } from '@ui/form/specialist/services/specialist.service';

@Component( {
    selector: 'bsm-specialist',
    imports: [ TranslatePipe, TextComponent, DefaultAvatarIconComponent, RightColumnLineComponent, NgTemplateOutlet, MoleculeMasterComponent ],
    templateUrl: './specialist.component.html',
    styleUrl: './specialist.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef( () => SpecialistComponent ),
            multi: true
        },
        SpecialistService
    ]
} )
export class SpecialistComponent implements ControlValueAccessor, OnInit {
    public options: InputSignal<PositionsTableItem[]> = input.required();
    public value: InputSignal<string | undefined> = input();
    public texts: InputSignal<SpecialistPopupTypesClass> = input.required();
    public isShowIcon: InputSignal<boolean> = input( false );
    public state: InputSignal<'master' | 'client'> = input.required();

    public searchValue: OutputEmitterRef<string> = output();

    private readonly appointmentGeneralService: AppointmentGeneralService = inject( AppointmentGeneralService );
    private readonly specialistService: SpecialistService = inject( SpecialistService );

    protected selectedOptions: Signal<PositionsTableItem | undefined> = computed( () => {
        let selectOption: string = this.specialistService.selectOption();
        return this.options().find( ( option: PositionsTableItem ) => {
            return option.getId() === selectOption;
        } );
    } );

    public onChange: ( value: string ) => void = () => {
    };
    public onTouched: () => void = () => {
    };

    protected addComma: Signal<string> = computed( () => {
        if ( this.selectedOptions()?.description ) {
            return ',';
        }
        return '';
    } );

    protected orderName: Signal<string> = computed( () => {
        if ( this.selectedOptions()?.description ) {
            return this.selectedOptions()?.orderName + ',';
        }
        return this.selectedOptions()?.orderName + '';
    } );

    constructor() {
        LanguageService.setLangData( langData[ LanguageService.getLangStatic() ] );
        this.observableParam( this.specialistService.searchTerm, this.emitSearchTerm );
        this.observableParam( this.specialistService.selectOption, this.changeSelectFunc );
        effect( () => {
            const options: PositionsTableItem[] = this.options();
            untracked( () => {
                this.specialistService.optionsSignal.set( options );
            } );
        } );
    }

    private changeSelectFunc = ( text: string ): void => {
        this.onChange( text );
    }
    
    private emitSearchTerm = ( text: string ): void => {
        this.searchValue.emit( text );
    }

    private observableParam( param: WritableSignal<string>, callback: ( value: string ) => void ): void {
        toObservable( param ).pipe(
            takeUntilDestroyed(),
            pairwise(),
            filter( ( [ prev, next ]: [ string, string ] ) => prev !== next ),
        ).subscribe( ( [ prev, next ]: [ string, string ] ) => callback( next ) );
    }

    public registerOnChange( fn: ( value: string ) => void ): void {
        this.onChange = fn;
    }

    public registerOnTouched( fn: () => void ): void {
        this.onTouched = fn;
    }

    public writeValue( id: string ): void {
        if ( this.specialistService.selectOption() !== id ) {
            this.specialistService.selectOption.set( id );
        }
    }

    @HostListener( 'click' ) public onClick(): void {
        this.specialistService.onSpecialistEvent();
    }

    public ngOnInit(): void {
        let value: string | undefined = this.value();
        this.specialistService.texts.set( this.texts() );
        if ( value ) {
            this.specialistService.selectOption.set( value );
        }
    }
}
