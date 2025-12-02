import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-success-info-error-icon]',
    imports: [],
    templateUrl: './success-info-error-icon.component.svg',
    styleUrl: './success-info-error-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        width: "60",
        height: "60",
        viewBox: "0 0 60 60",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    },
})
export class SuccessInfoErrorIconComponent {

}
