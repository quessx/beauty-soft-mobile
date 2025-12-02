import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "svg[beauty-rounded-check-icon]",
    imports: [],
    templateUrl: "./rounded-check-icon.component.svg",
    styleUrl: "./rounded-check-icon.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 16 16",
        color: "transparent",
    },
})
export class RoundedCheckIconComponent {}