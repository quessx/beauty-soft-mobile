import { ChangeDetectionStrategy, Component, effect, HostBinding, input, InputSignal } from '@angular/core';
import moment, { Moment } from 'moment';
import { ItemComponent } from './item/item.component';

@Component({
    selector: 'bsm-timeline',
    imports: [ItemComponent],
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent {
    public hours = Array(24);
    public minTime: InputSignal<string> = input('00:00');
    public maxTime: InputSignal<string> = input('24:00');

    constructor() {
        effect(() => {
            const from: Moment = moment(this.minTime(), 'HH:mm');
            const to: Moment = moment(this.maxTime(), 'HH:mm');
            const fromHour: number = Number(from.format('HH'));
            this.hours = Array.from({ length: Math.ceil(to.diff(from) / 1000 / 60 / 60) }, (v, k) => fromHour + k);
        });
    }

    public _height: InputSignal<number> = input(0);

    @HostBinding('style.height') get height(): string {
        return !!this._height() ? this._height() + 'px' : 'fit-content';
    }
}
