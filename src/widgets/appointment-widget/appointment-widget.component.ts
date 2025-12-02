import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, Signal, untracked, viewChild, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AppointmentEntity, AppointmentsStore, IAppointmentsStore } from '@entities/appointments';
import { AddOrderPopupFeatureService } from '@features/add-order-popup-feature/services/add-order-popup-feature.service';
import { BaseWidget } from '@lib/helpers/base-widget/base-widget.class';
import { AppointmentDataService, AppointmentGeneralService } from '@lib/services/appointment';
import { DefaultOverlayService } from '@lib/services/default-overlay';
import { SpecialistCoordinatorService } from '@ui/form/specialist/services/specialist-coordinator.service';
import { ActionsWrapperComponent, WRAPPER_BASE_DURATION } from '@ui/wrappers/actions-wrapper';
import { ElementActionsWrapperService } from '@ui/wrappers/actions-wrapper/services/element-actions-wrapper.service';
import { TOutletState, TPathOutlet } from '@widgets/appointment-widget/appointment-widget.types';
import { filter, map, Observable, pairwise, timer } from 'rxjs';
import { LoadDataService } from './services/load-data.service';

@Component( {
    selector: 'bsm-appointment-widget',
    imports: [ActionsWrapperComponent, RouterOutlet, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './appointment-widget.component.html',
    styleUrls: ['./appointment-widget.component.scss'],
    providers: [LoadDataService]
} )
export class AppointmentWidgetComponent extends BaseWidget {
    private loadDataService: LoadDataService = inject( LoadDataService );
    private router: Router = inject( Router );
    private route: ActivatedRoute = inject( ActivatedRoute );
    private appointmentGeneralService: AppointmentGeneralService = inject( AppointmentGeneralService );
    private appointmentsStore: IAppointmentsStore = inject( AppointmentsStore );
    private defaultOverlayService: DefaultOverlayService = inject( DefaultOverlayService );
    public actionsWrapper: Signal<ElementRef | undefined> = viewChild( 'actionsWrapper', { read: ElementRef } );
    protected readonly appointmentDataService: AppointmentDataService = inject( AppointmentDataService );
    private elementActionsWrapper: ElementActionsWrapperService = inject( ElementActionsWrapperService );
    private addOrderPopupFeatureService: AddOrderPopupFeatureService = inject( AddOrderPopupFeatureService );
    private specialistCoordinatorService: SpecialistCoordinatorService = inject( SpecialistCoordinatorService );
    private stateAction: WritableSignal<TOutletState | undefined> = signal( undefined );
    private baseDuration: number = 250;
    protected actionVariants: WritableSignal<Array<number | undefined>> = signal( [1, undefined] );
    protected isClientSelected: Signal<boolean> = toSignal( this.appointmentDataService.getClientForm().valueChanges.pipe( map( ( client ) => !!client.id ) ), { initialValue: false } );

    protected isConfirmDisabled: Signal<boolean> = computed( () => {
        return this.isClientSelected() || this.stateAction() === 'order';
    } );

    public constructor() {
        super();
        this.elementActionsWrapper.getOnCloseWrapper().pipe( takeUntilDestroyed() ).subscribe( () => {
            this.onCancel();
        } );

        this.appointmentGeneralService.getPayButtonSubjectAsObservable().pipe( takeUntilDestroyed() ).subscribe( () => {
            this.navigateOutlet( 'payment', false );
        } );

        this.appointmentGeneralService.getAddOrderSubjectAsObservable().pipe( takeUntilDestroyed() ).subscribe( () => {
            this.navigateOutlet( 'add-order' );
        } );
        this.specialistCoordinatorService.getSpecialistSubjectAsObservable().pipe( takeUntilDestroyed() ).subscribe( () => {
            this.navigateOutlet( 'specialist-popup' );
        } );
        this.specialistCoordinatorService.getSpecialistOnCancelSubjectAsObservable().pipe( takeUntilDestroyed() ).subscribe( () => {
            this.onCancel();
        } );

        this.appointmentDataService.getForm().controls.id.valueChanges.pipe(
            pairwise(),
            filter( ( [prev, curr]: [string, string] ) => curr !== prev ),
            takeUntilDestroyed()
        ).subscribe( ( [prev, curr]: [string, string] ) => {
            const currentAppointment: AppointmentEntity | undefined = untracked( this.getCurrentAppointment.bind( this ) );
            const variants: Array<number | undefined> = currentAppointment?.paid ? [1, undefined] : [3, 1];
            this.actionVariants.set( variants );
        } );

        this.router.events.pipe( takeUntilDestroyed(), filter( ( ev: unknown ) => ev instanceof NavigationEnd ) ).subscribe( () => {
            const outletActivated: ActivatedRoute | undefined = this.route.children.find( ( activatedRoute: ActivatedRoute ) => {
                return activatedRoute.snapshot.data?.['outletState'];
            } );

            if ( !outletActivated ) {
                const variants: Array<number | undefined> = this.isPaidSignal() ? [1, undefined] : [3, 1];
                this.actionVariants.set( variants );
                this.stateAction.set( undefined );
                return;
            }

            const outletState: TOutletState = outletActivated.snapshot.data?.['outletState'];
            this.stateAction.set( outletState );
            if ( outletState === 'payment' ) {
                this.actionVariants.set( [2, undefined] );
            } else if ( ['order', 'specialist'].includes( outletState ) ) {
                this.actionVariants.set( [2, 1] );
            }
        } );
    }

    private navigateOutlet( outlet: TPathOutlet | null, hideOverlay = true ): void {
        this.router.navigate( [{ outlets: { secondary: [outlet] } }], {
            relativeTo: this.route,
            skipLocationChange: true
        } ).finally( () => {
            if ( hideOverlay ) {
                this.defaultOverlayService.hide();
            }
        } );
    }

    public override preload(): Observable<boolean> {
        return this.loadDataService.loadData();
    }

    public isPaidSignal: Signal<boolean> = computed( () => {
        return this.getCurrentAppointment()?.paid || false;
    } );

    private getCurrentAppointment(): AppointmentEntity | undefined {
        return this.appointmentsStore.entityMap()[this.appointmentDataService.getForm().controls.id.value];
    }

    public onCancel(): void {
        if ( this.actionVariants()[0] === 2 ) {
            this.router.navigate( [{ outlets: { secondary: null } }], {
                relativeTo: this.route,
                skipLocationChange: true
            } );
        } else {
            this.router.navigate( ['/crm/booking'], { relativeTo: this.route, queryParamsHandling: 'merge', } );
        }
    }

    public onStartCancel(): void {
        if ( this.actionVariants()[0] === 2 && ['order', 'specialist'].includes( this.stateAction() + '' ) ) {
            timer( WRAPPER_BASE_DURATION ).subscribe( () => {
                this.router.navigate( ['/crm/booking'], { relativeTo: this.route, queryParamsHandling: 'merge', } );
            } );
        }
    }

    public onSave(): void {
        if ( this.stateAction() === 'order' ) {
            this.addOrderPopupFeatureService.selectedValue.set( this.addOrderPopupFeatureService.values() );
        } else if ( this.stateAction() !== 'specialist' ) {
            this.appointmentGeneralService.onCreateEvent();
        }
        this.onCancel();
    }

}
