import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';

@Component({
    selector: 'beauty-tooltip',
    imports: [],
    templateUrl: './tooltip.component.html',
    styleUrl: './tooltip.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent implements OnDestroy {
    private tooltip?: HTMLElement;
    private tooltipArrow?: HTMLImageElement;

    @Input() hint?: string | null;
    @Input() _left?: number;

    @HostListener('mouseenter') mouseenter = () => {
        requestAnimationFrame(() => {
            const rect: DOMRect = this.el.nativeElement.getBoundingClientRect();
            const offsetIfNode: number = this.el.nativeElement.firstChild instanceof Element ? rect.width / 2 : 0;

            const tooltip: HTMLDivElement = this.ren.createElement('div');
            this.ren.addClass(tooltip, 'tlp');
            this.ren.setStyle(tooltip, 'left', rect.left - offsetIfNode - 10 + 'px');
            this.ren.setProperty(tooltip, 'textContent', this.hint || this.el.nativeElement.textContent || '');
            this.ren.appendChild(document.body, tooltip);
            
            this.ren.setStyle(tooltip, 'top', rect.top - 11 - tooltip.clientHeight + 'px');
            let tooltipRect: DOMRect = tooltip.getBoundingClientRect();
            const tooltipOverflow: number = window.innerWidth - 186 - tooltipRect.x;
            if (tooltipOverflow < 0) {
                this.ren.setStyle(tooltip, 'left', tooltipRect.left + tooltipOverflow - 10 + 'px');
                tooltipRect = tooltip.getBoundingClientRect();

                this.ren.setStyle(tooltip, 'left', tooltipRect.left + 186 - tooltipRect.width + 'px');
                this.ren.setStyle(tooltip, 'top', rect.top - 9 - tooltipRect.height + 'px');
            }

            const tooltipArrow: HTMLImageElement = this.ren.createElement('img');
            this.ren.addClass(tooltipArrow, 'tooltip-arrow');
            this.ren.setAttribute(tooltipArrow, 'src', '/assets/icons/tooltip-arrow.svg');
            this.ren.setStyle(tooltipArrow, 'top', rect.top - 10 + 'px');
            this.ren.setStyle(tooltipArrow, 'left', rect.left - (this._left || offsetIfNode) + 'px');
            this.ren.appendChild(document.body, tooltipArrow);

            this.tooltip = tooltip;
            this.tooltipArrow = tooltipArrow;
        });

    };
    @HostListener('mouseleave') mouseleave = () => {
        this.tooltip?.remove();
        this.tooltipArrow?.remove();
    };

    constructor(private el: ElementRef<HTMLElement>, private ren: Renderer2) {

    }

    ngOnDestroy(): void {
        this.tooltip?.remove();
        this.tooltipArrow?.remove();
    }
}
