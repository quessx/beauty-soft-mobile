import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "svg[beauty-arrow-icon]",
    imports: [],
    templateUrl: "./arrow-icon.component.svg",
    styleUrl: "./arrow-icon.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "22",
        height: "22",
        viewBox: "0 0 22 22",
        fill: "none",
    },
})
export class ArrowIconComponent {}