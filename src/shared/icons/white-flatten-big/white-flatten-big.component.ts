import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[bsm-white-flatten-big]',
    imports: [],
    templateUrl: './white-flatten-big.component.svg',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        xmlnsXlink: "http://www.w3.org/1999/xlink",
        width: "430",
        height: "469",
        viewBox: "0 0 430 469",
        fill: "none"
    }
})
export class WhiteFlattenBigComponent {

}
