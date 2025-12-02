import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "svg[beauty-add-line-icon]",
    imports: [],
    templateUrl: "./add-line-icon.component.svg",
    styleUrl: "./add-line-icon.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 16 16",
    },
})
export class AddLineIconComponent {}