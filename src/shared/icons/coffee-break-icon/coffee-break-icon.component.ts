import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "svg[beauty-coffee-break-icon]",
    imports: [],
    templateUrl: "./coffee-break-icon.component.svg",
    styleUrl: "./coffee-break-icon.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "13",
        height: "12",
        viewBox: "0 0 13 12",
        color: "transparent",
    },
})
export class CoffeeBreakIconComponent {}