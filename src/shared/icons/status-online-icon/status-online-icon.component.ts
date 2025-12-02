import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'svg[beauty-status-online-icon]',
    imports: [],
    templateUrl: './status-online-icon.component.svg',
    styleUrl: './status-online-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        width: '12',
        height: '12',
        viewBox: '0 0 12 12',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg'
    }
})
export class StatusOnlineIconComponent {

}
