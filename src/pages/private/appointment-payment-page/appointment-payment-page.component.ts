import { Component } from '@angular/core';
import { AppointmentPaymentWidgetComponent } from '@widgets/appointment-payment-widget';

@Component( {
    selector: 'bsm-appointment-payment-page',
    templateUrl: './appointment-payment-page.component.html',
    styleUrls: ['./appointment-payment-page.component.scss'],
    imports: [AppointmentPaymentWidgetComponent]
} )
export class AppointmentPaymentPageComponent {
    constructor() { }

}
