import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "svg[bsm-notification-icon]",
    imports: [],
    templateUrl: "./notification-icon.component.svg",
    styleUrl: "./notification-icon.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
    },
})
export class NotificationIconComponent {}
