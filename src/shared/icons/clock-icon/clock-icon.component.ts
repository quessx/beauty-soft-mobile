import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-clock-icon]',
    imports: [],
    templateUrl: './clock-icon.component.svg',
    styleUrl: './clock-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        width: "12",
        height: "10",
        viewBox: "0 0 12 10",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    }
})
export class ClockIconComponent {

}
