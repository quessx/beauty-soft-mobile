import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-plus-icon]',
    imports: [],
    templateUrl: './plus-icon.component.svg',
    styleUrl: './plus-icon.component.css',
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
export class PlusIconComponent {
}
