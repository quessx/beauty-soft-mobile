import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppointmentLogWidgetComponent } from '@widgets/appointment-log-widget';

@Component({
    selector: 'beauty-appointment-log',
    imports: [AppointmentLogWidgetComponent],
    templateUrl: './appointment-log.component.html',
    styleUrl: './appointment-log.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentLogComponent {

}
