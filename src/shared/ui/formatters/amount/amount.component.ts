import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { amountFormatted } from './amount-formatted.function';

@Component({
    selector: 'beauty-amount',
    imports: [],
    templateUrl: './amount.component.html',
    styleUrl: './amount.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmountComponent {
    @Input() value: string | number = '';
    @Input() round: boolean = false;
    @Input() showSign: boolean = false;
    @Input() postfix?: string;
    @Input() useAltPostfix: boolean = false;
    @Input() prefix?: string;

    get formattedValue(): string {
        return amountFormatted(this.value, this.round, this.showSign);
    }
}
