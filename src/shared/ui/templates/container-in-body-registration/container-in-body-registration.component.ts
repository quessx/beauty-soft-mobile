import {
    booleanAttribute,
    Component,
    inject,
    input,
    InputSignal,
    output,
    OutputEmitterRef,
    Signal
} from '@angular/core';
import { TranslatePipe } from "beauty-soft-common";
import { KeyboardTrackService } from '@lib/services/keyboard-track/keyboard-track.service';
import { Button } from 'primeng/button';
import { ScreenSizeService } from '@lib/services/screen-size/screen-size.service';

@Component({
    selector: 'bsm-container-in-body-registration',
    templateUrl: './container-in-body-registration.component.html',
    styleUrls: ['./container-in-body-registration.component.scss'],
    imports: [
        TranslatePipe,
        Button
    ],
    host: {
        '[class.keyboard]': '!!keyboardHeight()'
    }
})
export class ContainerInBodyRegistrationComponent {
    backClicked: OutputEmitterRef<void> = output<void>();
    title: InputSignal<string | undefined> = input<string>();
    subtitle: InputSignal<string | undefined> = input<string>();
    withBackButton = input(false, { transform: booleanAttribute });

    protected keyboardHeight: Signal<number> = inject(KeyboardTrackService).getKeyboardHeight();
    protected resolution = inject(ScreenSizeService);

    protected onBackButtonClick(): void {
        this.backClicked.emit();
    }
}
