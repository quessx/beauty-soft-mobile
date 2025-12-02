import { CommonModule } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    Output
} from '@angular/core';
import { AppointmentAppointmentRead, AppointmentJsonldAppointmentRead } from '@api/index';
import { EventApi } from '@fullcalendar/core';
import { APPOINTMENT_COLORS } from "@lib/const";
import { AppointmentLogScheduletEventModel } from "@lib/types/appointment-log-schedule-event";
import { HeaderComponent } from "./header/header.component";
import { BodyComponent } from "./body/body.component";
import moment from "moment";

@Component({
    selector: 'beauty-calendate-card',
    imports: [
        CommonModule,
        HeaderComponent,
        BodyComponent
    ],
    templateUrl: './calendate-card.component.html',
    styleUrl: './calendate-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendateCardComponent {
    @Input() set model(model: EventApi) {
        if (!model || !model?.extendedProps || !model?.extendedProps?.['event']) {
            return;
        }
        this.eventModel = model.extendedProps['event'];
        this.state = model.extendedProps['event'].state;
        this.createdByRole = model.extendedProps['event'].createdByRole;
        this.note = model.extendedProps['note'];

        const key: string | undefined = model.extendedProps['appointment_color'];
        if (!key || moment.utc(model.endStr).diff(moment.utc(model.startStr)) / 1000 / 60 <= 30) {
            return;
        }
        if (!!key && Object.hasOwn(APPOINTMENT_COLORS, key)) {
            this._color = APPOINTMENT_COLORS[key as keyof typeof APPOINTMENT_COLORS];
        }
    }

    @Output() cardClick = new EventEmitter<void>();

    public eventModel: AppointmentLogScheduletEventModel | undefined = undefined;
    protected state: AppointmentAppointmentRead.StateEnum = 'waiting';
    protected createdByRole?: AppointmentJsonldAppointmentRead.CreatedByRoleEnum;
    protected note?: string | null;
    public _color?: string;

    @HostBinding('class') get hostClass(): string {
        const bgClasses = {
            confirmed: 'bg-confirmed',
            arrived: 'bg-arrived',
            not_arrived: 'bg-not_arrived',
            waiting: 'bg-waiting',
            cancelled: 'bg-cancelled'
        };
        return bgClasses[this.state];
    }

    @HostListener('click')
    onCardClick(): void {
        this.cardClick.emit();
    }
}
