import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, input, InputSignal, Renderer2 } from '@angular/core';
import { AppointmentLogScheduletEventModel } from '@lib/types/appointment-log-schedule-event';

@Component({
    selector: 'bsm-body',
    imports: [],
    templateUrl: './body.component.html',
    styleUrl: './body.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyComponent {
    public eventModel: InputSignal<AppointmentLogScheduletEventModel | undefined> = input.required();

    constructor(private elementRef: ElementRef<HTMLElement>, private ren: Renderer2) {
        afterNextRender(() => {
            const clientHeight: number = elementRef.nativeElement.scrollHeight;
            const scrollHeight: number = elementRef.nativeElement.clientHeight;
            const p: HTMLParagraphElement | null = elementRef.nativeElement.querySelector('p');
            if (clientHeight <= scrollHeight || !scrollHeight || !p) {
                return;
            }

            const index: number = Math.trunc(scrollHeight / p.clientHeight - 2 / p.clientHeight);
            const child: Element | null = elementRef.nativeElement.querySelector(`p:nth-child(${index + 2})`);
            if (!child) {
                return;
            }

            ren.setStyle(child, 'visibility', 'hidden');
        });
    }
}
