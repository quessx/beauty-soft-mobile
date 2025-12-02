import { ChangeDetectionStrategy, Component, HostBinding, input, Input, InputSignal } from '@angular/core';
import { RoundedCheckIconComponent } from '@icons/rounded-check-icon';
import { TDiscountSelectOption } from './types';

@Component({
    selector: 'bsm-promo-item',
    imports: [RoundedCheckIconComponent],
    templateUrl: './promo-item.component.html',
    styleUrl: './promo-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromoItemComponent {
    public promo: InputSignal<TDiscountSelectOption> = input.required();
    @Input() @HostBinding('class.selected') selected = false;
}
