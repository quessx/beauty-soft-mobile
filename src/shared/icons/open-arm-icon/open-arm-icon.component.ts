import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-open-arm-icon]',
    imports: [],
    templateUrl: './open-arm-icon.component.svg',
    styleUrl: './open-arm-icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        width: "64",
        height: "65",
        viewBox: "0 0 64 65",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
    }
})
export class OpenArmIconComponent {

}
