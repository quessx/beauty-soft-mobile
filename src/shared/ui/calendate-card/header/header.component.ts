import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { AppointmentAppointmentRead, AppointmentJsonldAppointmentRead } from '@api/index';
import { CheckIconComponent } from '@icons/check-icon';
import { ClockIconComponent } from '@icons/clock-icon';
import { CommentIconComponent } from '@icons/comment-icon';
import { MinusIconComponent } from '@icons/minus-icon';
import { PhoneIconComponent } from '@icons/phone-icon';
import { PlusIconComponent } from '@icons/plus-icon';
import { StatusOnlineIconComponent } from '@icons/status-online-icon';
import { IonSkeletonText, IonThumbnail } from '@ionic/angular/standalone';

@Component({
    selector: 'bsm-header',
    imports: [
        PlusIconComponent,
        CheckIconComponent,
        ClockIconComponent,
        MinusIconComponent,
        CommentIconComponent,
        StatusOnlineIconComponent,
        PhoneIconComponent,
        IonSkeletonText,
        IonThumbnail
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
    public state: InputSignal<AppointmentAppointmentRead.StateEnum> = input.required();
    public note: InputSignal<null | undefined | string> = input();
    public createdByRole: InputSignal<AppointmentJsonldAppointmentRead.CreatedByRoleEnum | undefined> = input();
}
