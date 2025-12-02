import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "svg[beauty-comment-icon]",
    imports: [],
    templateUrl: "./comment-icon.component.svg",
    styleUrl: "./comment-icon.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "12",
        height: "12",
        viewBox: "0 0 12 12",
        fill: 'none'
    },
})
export class CommentIconComponent {}