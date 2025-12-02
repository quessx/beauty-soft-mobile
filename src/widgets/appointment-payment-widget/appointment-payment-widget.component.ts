import { Component, computed, HostBinding, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentDiscountJsonldAppointmentRead } from '@api/index';
import { AppointmentDiscountStore, IAppointmentDiscountStore } from '@entities/appointment-discount';
import { AppointmentPaymentStore, IAppointmentPaymentStore } from '@entities/appointment-payment';
import { AppointmentEntity, AppointmentsStore, IAppointmentsStore, TAppliedDiscount } from '@entities/appointments';
import { ILoyaltyCardStore, LoyaltyCardStore, TDiscount } from '@entities/loyalty-card';
import { IPaymentMethodStore, PaymentMethodEntity, PaymentMethodStore } from '@entities/payment-method';
import { BankCardIconComponent } from '@icons/bank-card-icon';
import { CashIconComponent } from '@icons/cash-icon';
import { BaseWidget } from '@lib/helpers/base-widget/base-widget.class';
import { DefaultOverlayService } from '@lib/services/default-overlay';
import { patchState } from '@ngrx/signals';
import { setEntity } from '@ngrx/signals/entities';
import { animateCancel, WRAPPER_BASE_DURATION } from '@ui/wrappers/actions-wrapper';
import { ElementActionsWrapperService } from '@ui/wrappers/actions-wrapper/services/element-actions-wrapper.service';
import { LanguageService, TranslatePipe } from 'beauty-soft-common';
import { Observable } from 'rxjs';
import { langData } from './lang';
import { LoadDataService } from './services/load-data.service';
import { PromoItemComponent } from './ui/promo-item/promo-item.component';
import { TDiscountSelectOption } from './ui/promo-item/types';

@Component( {
    selector: 'bsm-appointment-payment-widget',
    templateUrl: './appointment-payment-widget.component.html',
    styleUrls: ['./appointment-payment-widget.component.scss'],
    imports: [PromoItemComponent, CashIconComponent, BankCardIconComponent, TranslatePipe],
    providers: [LoadDataService]
} )
export class AppointmentPaymentWidgetComponent extends BaseWidget {
    @HostBinding( 'class.disabled' ) private get isHostDisabled() {
        return !this.isLoading();
    };
    private router: Router = inject( Router );
    private loadDataService: LoadDataService = inject( LoadDataService );
    private elementActionsWrapper: ElementActionsWrapperService = inject( ElementActionsWrapperService );
    private appointmentPaymentStore: IAppointmentPaymentStore = inject( AppointmentPaymentStore );
    private paymentMethodStore: IPaymentMethodStore = inject( PaymentMethodStore );
    private loyaltyCardStore: ILoyaltyCardStore = inject( LoyaltyCardStore );
    private appointmentStore: IAppointmentsStore = inject( AppointmentsStore );
    private appointmentDiscountStore: IAppointmentDiscountStore = inject( AppointmentDiscountStore );
    private defaultOverlayService: DefaultOverlayService = inject( DefaultOverlayService );
    protected useLoyaltyPoints: WritableSignal<boolean> = signal( false );

    protected cashback: Signal<string> = computed( () => {
        const back: number = Number( this.appointmentStore.getSelectedAppointment()?.totalWithLoyalty?.totalCashback?.amount ) || 0;
        return back.toLocaleString();
    } );
    protected loyaltyPointsToUse: Signal<string> = computed( () => {
        const amount: number = Number( this.appointmentStore.getSelectedAppointment()?.totalWithLoyalty?.loyaltyPointsToUse?.amount ) || 0;
        return amount.toLocaleString();
    } );
    protected totalPrice: Signal<number> = computed( () => {
        let price: number;
        if ( this.useLoyaltyPoints() ) {
            price = Number( this.appointmentStore.getSelectedAppointment()?.totalWithLoyalty?.totalAfterDiscountsAfterLoyaltyPoints?.amount ) || 0;
        } else {
            price = Number( this.appointmentStore.getSelectedAppointment()?.totalWithLoyalty?.totalAfterDiscounts?.amount ) || 0;
        }
        return price;
    } );
    protected initialPrice: Signal<number> = computed( () => {
        return Number( this.appointmentStore.getSelectedAppointment()?.total?.amount ) || 0;
    } );
    protected selectedPromo: Signal<string[] | null> = computed( () => {
        const selectedIds: string[] | null = this.appointmentStore.getSelectedAppointment()?.totalWithLoyalty?.appliedDiscounts?.map( ( appliedDiscount: TAppliedDiscount ) => {
            if ( !appliedDiscount.discount?.['@id'] ) {
                throw new Error( 'no id' );
            }
            return appliedDiscount.discount['@id'];
        } ) || null;
        return selectedIds;
    } );
    protected promotions: Signal<TDiscountSelectOption[]> = computed( () => {
        return ( this.loyaltyCardStore.getCardAsSelectedClient()?.loyaltyCardType.discounts || [] ).map( ( discount: TDiscount ) => {
            return {
                id: discount['@id'] || '',
                label: discount.name,
                value: discount['@id'] || '',
                metadata: {
                    discountPercent: discount.discountPercent,
                    discountAmount: Number( discount.discountAmount?.amount ) || undefined
                }
            };
        } );
    } );

    constructor() {
        super();
        LanguageService.setLangData( langData[LanguageService.getLangStatic()] );
    }

    override preload(): Observable<boolean> {
        return this.loadDataService.loadData();
    }

    protected onClick( type: 'card' | 'cash' ): void {
        this.defaultOverlayService.show();
        const typeName: string = type === 'cash' ? 'Наличные' : 'Банковская карта';

        const selected: PaymentMethodEntity | undefined = this.paymentMethodStore.entities().find( ( method: PaymentMethodEntity ) => method.name === typeName );
        const appointment: AppointmentEntity = this.appointmentStore.getSelectedAppointment();
        if ( !selected?.['@id'] || !appointment?.['@id'] ) {
            this.defaultOverlayService.hide();
            return;
        }

        this.appointmentPaymentStore.create( { appointment: appointment['@id'], paymentMethod: selected['@id'], useLoyaltyPoints: this.useLoyaltyPoints() } ).subscribe( () => {
            animateCancel( this.elementActionsWrapper.actionsWrapperRef()?.nativeElement, WRAPPER_BASE_DURATION ).subscribe( () => {
                patchState( this.appointmentStore, setEntity( new AppointmentEntity( { ...appointment, state: 'arrived', paid: true } ) ) );
                this.router.navigate( ['crm/booking'] );
            } );
        } );
    }

    protected onPromoClick( id: string ): void {
        this.defaultOverlayService.show();
        const loadById: Function = () => {
            this.appointmentStore.loadById( this.appointmentStore.selectedId(), undefined, undefined, '1', undefined ).subscribe( () => {
                this.defaultOverlayService.hide();
            } );
        };

        if ( this.selectedPromo()?.includes( id ) ) {
            const index: number | undefined = this.appointmentStore.getSelectedAppointment().totalWithLoyalty?.appliedDiscounts?.findIndex( ( appliedDiscount: TAppliedDiscount ) => appliedDiscount.discount?.['@id'] == id );
            if ( index === undefined ) {
                return;
            }

            const appointmentDiscount: AppointmentDiscountJsonldAppointmentRead | undefined = this.appointmentStore.getSelectedAppointment().appointmentDiscounts?.at( index );
            if ( !appointmentDiscount ) {
                return;
            }

            this.appointmentDiscountStore.delete( appointmentDiscount.id ).subscribe( {
                next: () => {
                    loadById();
                }
            } );
        } else {
            this.appointmentDiscountStore.create( {
                appointment: this.appointmentStore.getSelectedAppointment()['@id'] || '',
                discount: id
            } ).subscribe( {
                next: () => {
                    loadById();
                }
            } );
        }
    }

    protected onBonusClick( usePoints: boolean ): void {
        this.useLoyaltyPoints.set( usePoints );
    }
}
