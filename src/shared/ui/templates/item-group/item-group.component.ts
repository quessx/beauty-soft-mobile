import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { RowComponent } from '@ui/templates/row';
import { TextComponent } from '@ui/text';

@Component( {
    selector: 'bsm-item-group',
    imports: [RowComponent, TextComponent],
    templateUrl: './item-group.component.html',
    styleUrls: ['./item-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class ItemGroupComponent {
    signature: InputSignal<string> = input('');
}
