import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {InformationIconComponent} from "@icons/information-icon";
import {TooltipArrowIconComponent} from "@icons/tooltip-arrow-icon";

@Component({
    selector: 'beauty-info-tooltip',
    imports: [InformationIconComponent, TooltipArrowIconComponent],
    templateUrl: './info-tooltip.component.html',
    styleUrl: './info-tooltip.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class InfoTooltipComponent {
    public _tooltipAfter: string | number = '';
    @Input() afterPostfix?: string;
    @Input() set tooltipAfter(it: string | number | undefined) {
        if(!it) {
            return;
        }
        const data: number = Number(it);
        isNaN(data) ? (this._tooltipAfter = it) : (this._tooltipAfter = data.toLocaleString());
    };
    public _tooltip: string | number = '';
    @Input() set tooltip(it: string | number | undefined) {
        if(!it) {
            return;
        }
        const data: number = Number(it);
        isNaN(data) ? (this._tooltip = it) : (this._tooltip = data.toLocaleString());
    };
}
