import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "svg[beauty-arrow-right-icon]",
    imports: [],
    templateUrl: "./arrow-right-icon.component.svg",
    styleUrl: "./arrow-right-icon.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
    },
})
export class ArrowRightIconComponent {}