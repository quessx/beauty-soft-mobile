import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Output } from '@angular/core';
import { CloseIconComponent } from '@icons/close-icon';

@Component({
    selector: 'beauty-horizontal-listbox-item',
    templateUrl: './horizontal-listbox-item.component.html',
    styleUrl: './horizontal-listbox-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CloseIconComponent]
})
export class HorizontalListboxItemComponent {
    public elementRef: ElementRef<HTMLDivElement> = inject(ElementRef);
    @Output() removeEvent: EventEmitter<any> = new EventEmitter();
}
