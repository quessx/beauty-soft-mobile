import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-spinner-icon]',
    imports: [],
    templateUrl: './spinner-icon.component.svg',
    styleUrl: './spinner-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "38",
        height: "38",
        viewBox: "0 0 38 38",
        color: "gray"
    }
})
export class SpinnerIconComponent {

}
