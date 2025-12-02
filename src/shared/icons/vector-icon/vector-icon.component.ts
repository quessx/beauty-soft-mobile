import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[bsm-vector-icon]',
    imports: [],
    templateUrl: './vector-icon.component.svg',
    styleUrl: './vector-icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        width: "11",
        height: "2",
        viewBox: "0 0 11 2",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    }
})
export class VectorIconComponent {

}
