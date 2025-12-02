import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-trash-can-icon]',
    imports: [],
    templateUrl: './trash-can-icon.component.svg',
    styleUrl: './trash-can-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    host: {
        width: '20',
        height: '20',
        viewBox: '0 0 20 20',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg'
    }
})
export class TrashCanIconComponent {
}
