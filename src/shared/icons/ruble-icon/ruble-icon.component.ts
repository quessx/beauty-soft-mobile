import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'svg[beauty-ruble-icon]',
    imports: [],
    templateUrl: './ruble-icon.component.svg',
    styleUrl: './ruble-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        width: "12",
        height: "12",
        viewBox: "0 0 12 12",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    }
})
export class RubleIconComponent {
    @Input() colorSvg: string = '#14151A';
}
