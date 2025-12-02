import { inject, Injectable, Injector } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsStore, IClientsStore } from '@entities/clients';
import { ILoyaltyCardStore, LoyaltyCardFilter, LoyaltyCardStore } from '@entities/loyalty-card';
import { IPaymentMethodStore, PaymentMethodStore } from '@entities/payment-method';
import { AppointmentGeneralService } from '@lib/services/appointment';
import { DefaultOverlayService } from '@lib/services/default-overlay';
import { ValidationPopupsService } from '@lib/services/validation';
import { patchState } from '@ngrx/signals';
import { combineLatest, filter, map, Observable, take, tap } from 'rxjs';

@Injectable()
export class LoadDataService {
    private paymentMethodStore: IPaymentMethodStore = inject( PaymentMethodStore );
    private loyaltyCardStore: ILoyaltyCardStore = inject( LoyaltyCardStore );
    private clientStore: IClientsStore = inject( ClientsStore );
    private _inj: Injector = inject( Injector );
    private appointmentGeneralService: AppointmentGeneralService = inject( AppointmentGeneralService );
    private defaultOverlayService: DefaultOverlayService = inject( DefaultOverlayService );
    private validationPopupsService: ValidationPopupsService = inject( ValidationPopupsService );
    private router: Router = inject( Router );
    private route: ActivatedRoute = inject( ActivatedRoute );

    loadData(): Observable<boolean> {
        const start: number = performance.now();
        this.defaultOverlayService.show();
        if ( !this.paymentMethodStore.isLoading() ) {
            this.paymentMethodStore.loadByFilter();
        }

        const loyaltyCardFilter: LoyaltyCardFilter = new LoyaltyCardFilter;
        loyaltyCardFilter.setFilterByName( 'client', this.clientStore.selectedId() );
        loyaltyCardFilter.setFilterByName( 'xClient', '1' );
        loyaltyCardFilter.setFilterByName( 'xLoyaltyCardType', '1' );
        patchState( this.loyaltyCardStore, { filter: loyaltyCardFilter, isLoading: false } );
        this.loyaltyCardStore.loadByFilter();

        return combineLatest( [
            toObservable( this.paymentMethodStore.isLoading, { injector: this._inj } ),
            toObservable( this.loyaltyCardStore.isLoading, { injector: this._inj } ),
            toObservable( this.appointmentGeneralService.onSaveEvent, { injector: this._inj } )
        ] ).pipe(
            filter( results => results.every( ( value: boolean ) => !!value ) ),
            take( 1 ),
            tap( () => {
                const transitionDuration: number = 250;
                const diff: number = performance.now() - start;
                const isInvalid: boolean = this.validationPopupsService.hasInvalidValues();
                const fun: Function = () => {
                    this.defaultOverlayService.hide();
                    if ( isInvalid ) {
                        this.router.navigate( ['..'], {
                            relativeTo: this.route,
                            skipLocationChange: true
                        } );
                    }
                };
                if ( diff > transitionDuration ) {
                    fun();
                } else {
                    setTimeout( () => {
                        fun();
                    }, transitionDuration - diff );
                };

            } ),
            map( () => true )
        );
    }
}
