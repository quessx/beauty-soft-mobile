import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
    selector: "beauty-empty-state",
    imports: [],
    templateUrl: "./empty-state.component.html",
    styleUrl: "./empty-state.component.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
    public title = input.required<string>();
    public description = input.required<string>();
}
