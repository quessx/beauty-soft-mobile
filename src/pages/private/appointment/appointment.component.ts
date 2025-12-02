import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AppointmentWidgetComponent } from "@widgets/appointment-widget";

@Component( {
    selector: 'bsm-appointment',
    imports: [AppointmentWidgetComponent],
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
} )
export class AppointmentComponent {

}
