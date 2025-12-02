import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { FilterIconComponent } from '@icons/filter-icon';

@Component({
    selector: 'bsm-filter-btn',
    imports: [FilterIconComponent],
    templateUrl: './filter-btn.component.html',
    styleUrl: './filter-btn.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBtnComponent {
    @HostBinding('class.active') @Input() public active: boolean = false;
}
