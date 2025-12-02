import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarWidgetComponent } from "@widgets/topbar-widget";

@Component( {
    selector: 'bsm-crm-page',
    imports: [RouterOutlet, TopbarWidgetComponent],
    templateUrl: './crm-page.component.html',
    styleUrl: './crm-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class CrmPageComponent implements OnInit {
    constructor(  ) {

    }

    ngOnInit(): void {

    }
}