import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-minus-icon]',
    imports: [],
    templateUrl: './minus-icon.component.svg',
    styleUrl: './minus-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        width: "12",
        height: "12",
        viewBox: "0 0 12 12",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    }
})
export class MinusIconComponent {

}
