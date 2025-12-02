import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "svg[beauty-bank-card-icon]",
    imports: [],
    templateUrl: "./bank-card-icon.component.svg",
    styleUrl: "./bank-card-icon.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "52",
        height: "52",
        viewBox: "0 0 52 52",
        color: "#FC7B99",
    },
})
export class BankCardIconComponent {}
