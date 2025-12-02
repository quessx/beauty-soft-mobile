import { Component, OnInit } from '@angular/core';
import { AddOrederPopupWidgetComponent } from '@widgets/add-oreder-popup-widget/add-oreder-popup-widget.component';

@Component( {
    selector: 'bsm-add-order-popup-page',
    imports: [ AddOrederPopupWidgetComponent ],
    templateUrl: './add-order-popup-page.component.html',
    styleUrls: [ './add-order-popup-page.component.scss' ],
} )
export class AddOrderPopupPageComponent {

    constructor() {
    }
}
