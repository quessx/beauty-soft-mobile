import { ChangeDetectionStrategy, Component, input, InputSignal, computed, Signal } from '@angular/core';
import { TTextColor, TTextType } from '@ui/text/types/text.types';

@Component({
    selector: 'bsm-text',
    imports: [],
    templateUrl: './text.component.html',
    styleUrl: './text.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class]': 'cssClasses()',
        '[attr.title]': 'title()'
    }
})
export class TextComponent {
    public type: InputSignal<TTextType> = input.required<TTextType>();
    public color: InputSignal<TTextColor> = input.required<TTextColor>();
    public title: InputSignal<string> = input<string>( '' );

    protected cssClasses: Signal<string> = computed(() => {
        return `${ this.type() } ${ this.color() }`;
    });
}
