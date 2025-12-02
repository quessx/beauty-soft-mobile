import { Attribute, ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnDestroy, Renderer2 } from '@angular/core';
import { EventApi } from '@fullcalendar/core';
import { CoffeeBreakIconComponent } from '@icons/coffee-break-icon';

@Component({
    selector: 'beauty-appintment-log-schedule-break-card',
    imports: [CoffeeBreakIconComponent],
    templateUrl: './appintment-log-schedule-break-card.component.html',
    styleUrl: './appintment-log-schedule-break-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppintmentLogScheduleBreakCardComponent implements OnDestroy {
    @Input() event: EventApi | null = null;
    private obs: ResizeObserver | undefined;

    @HostBinding('class.multi-line') get isOneLine(): boolean {
        if (!this.event || !this.event.end || !this.event.start) {
            return false;
        }

        const diff: number = this.event.end.getTime() - this.event.start.getTime();
        return diff / 1000 / 60 > 30 ? true : false;
    }

    constructor(private elementRef: ElementRef<HTMLElement>, private ren: Renderer2, @Attribute('observe-size') observeSize: string) {
        if (typeof observeSize === 'string') {
            this.obs = new ResizeObserver((entries: ResizeObserverEntry[]) => {
                const el: HTMLSpanElement | null = this.elementRef.nativeElement.querySelector('span');
                if (!el) {
                    return;
                }
                for (let entry of entries) {
                    if (entry.borderBoxSize[0].inlineSize >= 72) {
                        this.ren.setStyle(el, 'display', 'block');
                    } else {
                        this.ren.setStyle(el, 'display', 'none');
                    }
                }
            });
            this.obs?.observe(elementRef.nativeElement);
        }
    }

    ngOnDestroy(): void {
        this.obs?.disconnect();
    }
}
