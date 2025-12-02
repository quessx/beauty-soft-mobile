import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-tooltip-arrow-icon]',
    imports: [],
    templateUrl: './tooltip-arrow-icon.component.svg',
    styleUrl: './tooltip-arrow-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        width: "15",
        height: "6",
        viewBox: "0 0 15 6",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    }
})
export class TooltipArrowIconComponent {}
