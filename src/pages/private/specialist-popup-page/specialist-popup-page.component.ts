import { Component, OnInit } from '@angular/core';
import { SpecialistPopupWidgetComponent } from '@widgets/specialist-popup-widget';

@Component( {
    selector: 'bsm-specialist-popup-page',
    templateUrl: './specialist-popup-page.component.html',
    styleUrls: [ './specialist-popup-page.component.scss' ],
    imports: [ SpecialistPopupWidgetComponent ]
} )
export class SpecialistPopupPageComponent implements OnInit {

    public constructor() {
    }

    public ngOnInit(): void {
    }

}
