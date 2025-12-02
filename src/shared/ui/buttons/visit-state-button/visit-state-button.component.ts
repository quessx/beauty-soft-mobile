import { ChangeDetectionStrategy, Component, HostBinding, Input, signal, WritableSignal } from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import { AppointmentAppointmentRead } from '@api/index';
import { ClockIconComponent } from '@icons/clock-icon';
import { CheckIconComponent } from '@icons/check-icon';
import { PlusIconComponent } from '@icons/plus-icon';
import { MinusIconComponent } from '@icons/minus-icon';
import { TextComponent } from '@ui/text';

@Component({
    selector: 'beauty-visit-state-button',
    imports: [ClockIconComponent, CheckIconComponent, PlusIconComponent, MinusIconComponent, TextComponent],
    templateUrl: './visit-state-button.component.html',
    styleUrl: './visit-state-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitStateButtonComponent {
    @Input() set state(state: AppointmentAppointmentRead.StateEnum) {
        this._state = state;
        this.text.set(LanguageService.translate(`front_general.visit_state.${ this._state }`))
    }

    get state(): AppointmentAppointmentRead.StateEnum {
        return this._state;
    }

    private _state: AppointmentAppointmentRead.StateEnum = 'waiting';
    public text: WritableSignal<string> = signal<string>('')

    @HostBinding('class') get classForState() {
        return `visit-state-${ this._state }`;
    }
}
