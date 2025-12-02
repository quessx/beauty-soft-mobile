import { Component, input, InputSignal, InputSignalWithTransform } from '@angular/core';
import { ArrowRightIconComponent } from '@icons/arrow-right-icon';
import { TextComponent, TTextColor, TTextType } from '@ui/text';
import { LanguageService } from 'beauty-soft-common';

@Component( {
    selector: 'bsm-next-action-button',
    templateUrl: './next-action-button.component.html',
    styleUrls: ['./next-action-button.component.scss'],
    imports: [TextComponent, ArrowRightIconComponent]
} )
export class NextActionButtonComponent {
    public text: InputSignalWithTransform<string, string> = input( '', { transform: LanguageService.translate } );
    public color: InputSignal<TTextColor> = input<TTextColor>('primary');
    public type: InputSignal<TTextType> = input<TTextType>('body-s');
    
    constructor() { }
}
