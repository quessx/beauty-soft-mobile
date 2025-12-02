import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-calendate-icon]',
    imports: [],
    templateUrl: './calendate-icon.component.svg',
    styleUrl: './calendate-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    host: {
        xmlns: 'http://www.w3.org/2000/svg',
        width: '16',
        height: '16',
        viewBox: '0 0 16 16',
        fill: 'none'
    }
})
export class CalendateIconComponent {
}
