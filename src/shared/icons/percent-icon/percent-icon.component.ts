import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component( {
    selector: 'svg[beauty-percent-icon]',
    imports: [],
    templateUrl: './percent-icon.component.svg',
    styleUrl: './percent-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    host: {
        width: "13",
        height: "12",
        viewBox: "0 0 13 12",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    }
} )
export class PercentIconComponent {
    @Input() colorSvg: string = '#14151A';
}
