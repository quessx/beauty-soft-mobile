import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { FilterIconComponent } from '@icons/filter-icon';
import { UserImageComponent } from 'beauty-soft-common';

@Component({
    selector: 'bsm-filter',
    imports: [UserImageComponent, FilterIconComponent],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent {
    public _src: InputSignal<string | undefined | null> = input();
}
