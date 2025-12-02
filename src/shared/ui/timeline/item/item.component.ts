import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';

@Component({
    selector: 'bsm-item',
    imports: [],
    templateUrl: './item.component.html',
    styleUrl: './item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {
    public hour: InputSignal<number> = input.required();
}
