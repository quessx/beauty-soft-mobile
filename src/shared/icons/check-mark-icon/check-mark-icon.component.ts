import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-check-mark-icon]',
    imports: [],
    templateUrl: './check-mark-icon.component.svg',
    styleUrl: './check-mark-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "20",
        height: "20",
        viewBox: "0 0 20 20",
        fill: "none"
    }
})
export class CheckMarkIconComponent {

}
