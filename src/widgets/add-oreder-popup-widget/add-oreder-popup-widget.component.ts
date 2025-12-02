import { Component, inject, OnInit } from '@angular/core';
import { BaseWidget } from '@lib/helpers/base-widget/base-widget.class';
import { Observable } from 'rxjs';
import { LoadDataService } from './services/load-data.service';
import { AddOrderPopupFeatureComponent } from '@features/add-order-popup-feature/add-order-popup-feature.component';
import { DefaultOverlayComponent } from '@lib/services/default-overlay';

@Component( {
    selector: 'bsm-add-oreder-popup-widget',
    imports: [ AddOrderPopupFeatureComponent, DefaultOverlayComponent ],
    templateUrl: './add-oreder-popup-widget.component.html',
    styleUrls: [ './add-oreder-popup-widget.component.scss' ],
    providers: [ LoadDataService ]
} )
export class AddOrederPopupWidgetComponent extends BaseWidget implements OnInit {
    private loadDataService: LoadDataService = inject( LoadDataService );

    constructor() {
        super();
    }

    public override ngOnInit() {
        super.ngOnInit();
    }

    public override preload(): Observable<boolean> {
        return this.loadDataService.loadData();
    }

}
