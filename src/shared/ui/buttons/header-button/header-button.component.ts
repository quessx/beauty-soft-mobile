import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { ArrowIconComponent } from '@icons/arrow-icon';
import { TextComponent, TTextColor } from "@ui/text";
import { THeaderButtonState } from './types/header-button.types';

@Component({
    selector: 'bsm-header-button',
    templateUrl: './header-button.component.html',
    styleUrls: ['./header-button.component.scss'],
    imports: [ArrowIconComponent, TextComponent],
    host: {
        '[attr.disabled]': 'state() === "disabled" || null',
        '[class]': 'state()',
        '(click)': 'handleClick($event)'
    }
})
export class HeaderButtonComponent {
    public state: InputSignal<THeaderButtonState> = input<THeaderButtonState>('enabled');

    public text: InputSignal<string> = input('');

    public withIcon: InputSignal<boolean> = input(false);

    public textColor: Signal<TTextColor> = computed(() => {
        switch(this.state()) {
            case 'enabled': {
                return 'blue'
            }
            case 'disabled': {
                return 'quaternary';
            }
            case 'red': {
                return 'red';
            }
        }
    });

    handleClick(ev: MouseEvent) {
        if (this.state() === 'disabled') {
            ev.preventDefault();
            ev.stopPropagation();
        }
    }
}
