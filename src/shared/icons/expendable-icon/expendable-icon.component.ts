import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { TExpendableState } from './expendable-icon.types';

@Component({
    selector: 'svg[beauty-expendable-icon]',
    imports: [],
    templateUrl: './expendable-icon.component.svg',
    styleUrl: './expendable-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        width: '10',
        height: '10',
        viewBox: '0 0 10 10',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg'
    },
    animations: [
        trigger('openClose', [
            state('open', style({})),
            state(
                'closed',
                style({
                    transform: 'rotate(180deg)'
                })
            ),
            transition('open <=> close', animate('0.7s ease-in-out'))
        ])
    ],
    standalone: true
})
export class ExpendableIconComponent {
    @Input() set state(state: TExpendableState) {
        this.animationState = state;
    }

    @HostBinding('@openClose') animationState = 'closed';
}
