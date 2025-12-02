import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, input, InputSignal, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ClientJsonldClientRead } from '@api/model/clientJsonldClientRead';
import { AppointmentEntity, AppointmentsStore, IAppointmentsStore } from '@entities/appointments';
import { ClientFilter, ClientsStore, IClientsStore } from '@entities/clients';
import { EmployeesStore, IEmployeesStore } from '@entities/employees';
import { ILoyaltyCardStore, LoyaltyCardFilter, LoyaltyCardStore } from '@entities/loyalty-card';
import { ISpecialityStore, PositionsTableItem, SpecialityStore } from '@entities/speciality';
import { AddOrderFeatureComponent } from '@features/add-order-feature';
import { BaseWidget } from '@lib/helpers/base-widget/base-widget.class';
import { AppointmentDataService, AppointmentGeneralService, TSelectedService } from '@lib/services/appointment';
import { ValidationPopupsService } from '@lib/services/validation';
import { patchState } from '@ngrx/signals';
import { TextComponent } from '@ui/text';
import { TimeRangeInputComponent } from '@ui/form-elements';
import { VisitStateBlockComponent } from '@ui/form-elements/visit-state-block/visit-state-block.component';
import { BeautyInputDateComponent } from '@ui/form/beauty-input-date';
import { SpecialistComponent } from '@ui/form/specialist';
import { SpecialistPopupTypesClass } from '@ui/popups/specialist-popup';
import { LeftColumnForLineComponent } from '@ui/templates/left-column-for-line';
import { RightColumnLineComponent } from '@ui/templates/right-column-line';
import { TemplateBodyOfModalComponent } from '@ui/templates/template-body-of-modal';
import { TemplateLeftColumnCardComponent } from '@ui/templates/template-left-column-card';
import { TemplateLineComponent } from '@ui/templates/template-line';
import { TemplateWhiteBackgroundComponent } from '@ui/templates/template-white-background';
import { TStateSpecialistComponent } from '@widgets/appointment-details-widget/appointment-details-widget.types';
import { LanguageService, TranslatePipe } from 'beauty-soft-common';
import { parsePhoneNumberFromString, PhoneNumber } from 'libphonenumber-js';
import moment from 'moment/moment';
import { filter, Observable, pairwise, Subscription } from 'rxjs';
import { TStateDetails } from './index';
import { langData } from './lang/lang';
import { LoadDataService } from './services/load-data.service';

@Component( {
    selector: 'bsm-appointment-details-widget',
    imports: [RouterOutlet, ReactiveFormsModule, VisitStateBlockComponent, CdkTextareaAutosize, TimeRangeInputComponent, SpecialistComponent, AddOrderFeatureComponent, FormsModule, TranslatePipe, TextComponent, BeautyInputDateComponent, TemplateLineComponent, LeftColumnForLineComponent, RightColumnLineComponent, TemplateBodyOfModalComponent, TemplateWhiteBackgroundComponent, TemplateLeftColumnCardComponent],
    templateUrl: './appointment-details-widget.component.html',
    styleUrl: './appointment-details-widget.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [LoadDataService]
} )
export class AppointmentDetailsWidgetComponent extends BaseWidget implements OnDestroy {
    public state: InputSignal<TStateDetails> = input.required();

    private route: ActivatedRoute = inject( ActivatedRoute );
    public clientsStore: IClientsStore = inject( ClientsStore );
    protected specialityStore: ISpecialityStore = inject( SpecialityStore );
    protected employeesStore: IEmployeesStore = inject( EmployeesStore );
    protected readonly appointmentDataService: AppointmentDataService = inject( AppointmentDataService );
    protected readonly appointmentGeneralService: AppointmentGeneralService = inject( AppointmentGeneralService );
    public loyaltyCardStore: ILoyaltyCardStore = inject( LoyaltyCardStore );
    protected validationPopupsService: ValidationPopupsService = inject( ValidationPopupsService );
    private subscriptions: Subscription[] = [];
    private cdr: ChangeDetectorRef = inject( ChangeDetectorRef );
    private appointmentsStore: IAppointmentsStore = inject( AppointmentsStore );
    private loadDataService: LoadDataService = inject( LoadDataService );
    protected hasSelectedServices: WritableSignal<boolean> = signal( this.appointmentDataService.selectedServices.length > 0 );
    private temporaryData: WritableSignal<ClientJsonldClientRead[] | undefined> = signal( undefined );
    protected searchClientSignal: WritableSignal<string> = signal( '' );

    public buttonListPopupModelSignal: Signal<PositionsTableItem[]> = computed( () => {
        let temporaryData: ClientJsonldClientRead[] | undefined = this.temporaryData();
        if ( !!temporaryData ) {
            return this.getButtonListPopupModelOptions( temporaryData );
        }
        return this.getButtonListPopupModelOptions( this.clientsStore.entities() );
    } );
    public isPaidSignal: Signal<boolean> = computed( () => {
        return this.getCurrentAppointment()?.paid || false;
    } );

    private getCurrentAppointment(): AppointmentEntity | undefined {
        return this.appointmentsStore.entityMap()[this.appointmentDataService.getForm().controls.id.value];
    }
    public constructor() {
        super();
        LanguageService.setLangData( langData[LanguageService.getLangStatic()] );
        let validateServiceChanges: Subscription = this.validationPopupsService.getInvalidForm().valueChanges.subscribe( () => {
            this.cdr.detectChanges();
        } );
        moment.locale( 'ru' );
        this.appointmentDataService.selectedServices.valueChanges.pipe( takeUntilDestroyed() ).subscribe( ( value: Partial<TSelectedService>[] ) => {
            this.hasSelectedServices.set( value.length > 0 );
        } );
        this.appointmentDataService.getClientForm().controls.name.valueChanges.pipe(
            takeUntilDestroyed(),
        ).subscribe( ( next: string ) => {
            this.validationPopupsService.getInvalidForm().reset();
            this.updateClientForm( next );
        } );
        let filterToName: Subscription = toObservable( this.searchClientSignal ).pipe(
            takeUntilDestroyed(),
            pairwise(),
            filter( ( [prev, next]: [string, string] ) => prev !== next ),
        ).subscribe( ( [prev, next]: [string, string] ) => {
            this.setFilterByName( 'q', next );
            this.validationPopupsService.getInvalidForm().get( 'name' )?.reset();
            this.appointmentDataService.getClientForm().patchValue( {
                _name: next
            }, { emitEvent: false } );
        } );

        const fromTimeSub: Subscription | undefined = this.appointmentDataService.getForm().get('fromTime')?.valueChanges.subscribe(() => {
            this.cdr.detectChanges();
        });
        const toTimeSub: Subscription | undefined = this.appointmentDataService.getForm().get('toTime')?.valueChanges.subscribe(() => {
            this.cdr.detectChanges();
        });

        fromTimeSub && this.subscriptions.push(fromTimeSub);
        toTimeSub && this.subscriptions.push(toTimeSub);

        this.subscriptions.push( filterToName, validateServiceChanges );
    }

    protected getSpecialistTexts( state: TStateSpecialistComponent ): SpecialistPopupTypesClass {
        return new SpecialistPopupTypesClass( {
            wrapperTexts: {
                closeButton: LanguageService.translate( `appointment_details_widget.details_info.specialists_popup.${state}.wrapper.close_button` ),
                successButton: LanguageService.translate( `appointment_details_widget.details_info.specialists_popup.${state}.wrapper.success_Button` ),
                label: LanguageService.translate( `appointment_details_widget.details_info.specialists_popup.${state}.wrapper.label` ),
                icon: LanguageService.translate( `appointment_details_widget.details_info.specialists_popup.${state}.wrapper.icon` )
            },
            emptyStateTexts: {
                title: LanguageService.translate( `appointment_details_widget.details_info.specialists_popup.${state}.empty_state.title` ),
                placeholder: LanguageService.translate( `appointment_details_widget.details_info.specialists_popup.${state}.empty_state.placeholder` ),
                button: LanguageService.translate( `appointment_details_widget.details_info.specialists_popup.${state}.empty_state.button` )
            }
        } );
    }

    private setFilterByName( name: string, value: string ): void {
        let clientFilter: ClientFilter = new ClientFilter();
        clientFilter.setFilterByName( 'itemsPerPage', 30 );
        if ( !!value ) {
            clientFilter.setFilterByName( name, value );
        }
        this.clientsStore.loadByFilterTemporaryData( clientFilter ).subscribe( {
            next: ( clients: ClientJsonldClientRead[] | undefined ) => {
                this.temporaryData.set( clients );
            },
            error: ( error: unknown ) => {
                console.error( 'Error get data', error );
            }
        } );
    }

    private updateClientForm( id: string ): this {
        let clientData: ClientJsonldClientRead[] | undefined = this.temporaryData() ? this.temporaryData() : this.clientsStore.entities();
        let client: ClientJsonldClientRead | undefined;
        if ( clientData ) {
            client = clientData.find( ( item: ClientJsonldClientRead ) => item.id === id );
        }
        if ( !client ) {
            console.log( "No client" );
            return this;
        }
        this.appointmentDataService.putClientForm( client );
        this.getLoyaltyCard( client.id );
        patchState( this.clientsStore, { selectedId: client.id } );
        return this;
    }

    private getLoyaltyCard( clientId: string ): this {
        let filter: LoyaltyCardFilter = new LoyaltyCardFilter();
        filter.setFilterByName( 'client', clientId );
        filter.setFilterByName( 'xClient', '1' );
        filter.setFilterByName( 'xLoyaltyCardType', '1' );
        patchState( this.loyaltyCardStore, { filter } );
        this.loyaltyCardStore.loadByFilter();
        return this;
    }

    public override ngOnInit(): void {
        super.ngOnInit();
    }

    public override preload(): Observable<boolean> {
        return this.loadDataService.loadData( this.route );
    }

    private getButtonListPopupModelOptions( clients: ClientJsonldClientRead[] = [] ): PositionsTableItem[] {
        return ( clients || [] ).map( ( client: ClientJsonldClientRead ) => {
            return new PositionsTableItem( {
                id: client.id,
                orderName: client.fullName || client.name,
                description: this.formatPhone( client?.phone ) || '',
            } );
        } );
    }

    private formatPhone( phone?: string ): string {
        if ( !phone ) {
            return '';
        }
        const trimmed: string = phone.trim();
        try {
            const pn: PhoneNumber | undefined = parsePhoneNumberFromString( trimmed, 'RU' );
            if ( pn ) {
                const intl: string = pn.formatInternational();
                if ( pn.country === 'RU' || pn.countryCallingCode === '7' ) {
                    const parts: string[] = intl.split( ' ' ).filter( Boolean );
                    if ( parts.length >= 5 ) {
                        return `${parts[0]} ${parts[1]} ${parts[2]}-${parts[3]}-${parts[4]}`;
                    }
                    if ( parts.length === 4 ) {
                        return `${parts[0]} ${parts[1]} ${parts[2]}-${parts[3]}`;
                    }
                }
                const generalParts: string[] = intl.split( ' ' ).filter( Boolean );
                if ( generalParts.length > 3 ) {
                    const head: string = generalParts.slice( 0, 3 ).join( ' ' );
                    const tail: string = generalParts.slice( 3 ).join( '-' );
                    return `${head} ${tail}`;
                }
                return intl;
            }
        } catch ( _e ) {
            console.error( _e );
        }
        return trimmed;
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach( ( subscription: Subscription ) => {
            if (subscription) {
                subscription.unsubscribe();
            }
        } );
    }

}
