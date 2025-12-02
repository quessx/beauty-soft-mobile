import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { PaymentCardDataModel } from '@lib/types/payment-card-data';
import { PaymentCardDataType } from '@lib/enums/payment-card-data-type';

@Component({
  selector: 'beauty-payment-card',
  imports: [NgClass],
  templateUrl: './payment-card.component.html',
  styleUrl: './payment-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentCardComponent {
    public data = input.required<PaymentCardDataModel>();
    public onClicked = output<void>();
    public PaymentCardDataType = PaymentCardDataType;

    @HostListener('click')
    public onClick(): void {
        this.onClicked.emit();
    }
}
