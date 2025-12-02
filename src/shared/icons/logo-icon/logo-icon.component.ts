import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-logo-icon]',
    imports: [],
    templateUrl: './logo-icon.component.svg',
    styleUrl: './logo-icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "73",
        height: "38",
        viewBox: "0 0 73 38",
        fill: "none"
    }
})
export class LogoIconComponent {

}
