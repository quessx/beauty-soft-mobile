import { ChangeDetectionStrategy, Component, effect, ElementRef, input, InputSignal, Renderer2 } from '@angular/core';
import { ArrowUpLineIconComponent } from '@icons/arrow-up-line-icon';
import { TextComponent } from '@ui/text';
import { Moment } from 'moment';

@Component( {
    selector: 'bsm-next-day-progress',
    imports: [ArrowUpLineIconComponent, TextComponent],
    templateUrl: './next-day-progress.component.html',
    styleUrl: './next-day-progress.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class NextDayProgressComponent {
    public day: InputSignal<Moment | null> = input<Moment | null>( null );
    public progress: InputSignal<number> = input( 0 );

    constructor( elementRef: ElementRef<HTMLElement>, ren: Renderer2 ) {
        const maxHeight: number = 60;
        effect( () => {
            // const scale = this.progress() * maxHeight;
            ren.setStyle( elementRef.nativeElement, 'transform', `translateX(-50%) scale(${this.progress()})` );
        } );
    }
}
