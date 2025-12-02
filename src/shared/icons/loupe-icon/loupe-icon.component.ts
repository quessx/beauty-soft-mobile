import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[bsm-loupe-icon]',
    imports: [],
    templateUrl: './loupe-icon.component.svg',
    styleUrl: './loupe-icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        width: "20",
        height: "20",
        viewBox: "0 0 20 20",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    }
})
export class LoupeIconComponent {

}
