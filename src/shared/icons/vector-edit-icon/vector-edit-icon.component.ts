import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[bsm-vector-edit-icon]',
    imports: [],
    templateUrl: './vector-edit-icon.component.svg',
    styleUrl: './vector-edit-icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        width: "12",
        height: "12",
        viewBox: "0 0 12 12",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    }
})
export class VectorEditIconComponent {

}
