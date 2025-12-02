import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "svg[beauty-arrow-down-icon]",
    imports: [],
    templateUrl: "./arrow-down-icon.component.svg",
    styleUrl: "./arrow-down-icon.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        viewBox: "0 0 18 18",
        fill: "none",
    },
})
export class ArrowDownIconComponent {}