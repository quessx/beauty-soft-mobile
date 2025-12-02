import { ChangeDetectionStrategy, Component, ElementRef, inject, Input } from '@angular/core';

@Component({
    selector: 'svg[beauty-filter-icon]',
    imports: [],
    templateUrl: './filter-icon.component.svg',
    styleUrl: './filter-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    host: {
        width: '16',
        height: '16',
        viewBox: '0 0 16 16',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg'
    }
})
export class FilterIconComponent {
    private elRef: ElementRef = inject(ElementRef);

    @Input() set _color(it: string | undefined) {
        if (it) {
            this.elRef.nativeElement.style.color = it;
        } else {
            this.elRef.nativeElement.style.color = '#9EA0A8';
        }
    };

}
