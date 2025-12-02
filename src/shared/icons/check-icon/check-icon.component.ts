import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-check-icon]',
    imports: [],
    templateUrl: './check-icon.component.svg',
    styleUrl: './check-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        width: "12",
        height: "12",
        viewBox: "0 0 12 12",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    }
})
export class CheckIconComponent {

}
