import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-close-icon]',
    imports: [],
    templateUrl: './close-icon.component.svg',
    styleUrl: './close-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    host: {
        width: '14',
        height: '14',
        viewBox: '0 0 14 14',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg'
    }
})
export class CloseIconComponent {
}
