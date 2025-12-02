import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "svg[beauty-uncheckboxed-icon]",
    imports: [],
    templateUrl: "./uncheckboxed-icon.component.svg",
    styleUrl: "./uncheckboxed-icon.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "20",
        height: "20",
        viewBox: "0 0 20 20",
        fill: "none",
    },
})
export class UncheckboxedIconComponent {}