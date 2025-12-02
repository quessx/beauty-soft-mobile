import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'ui-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
    @Input() public options: string[] = [];
    @Input() public selected: string = '';
    @Output() public selectedChange = new EventEmitter<string>();

    public onSelect(option: EventTarget | null): void {
        if (!option || !(option instanceof HTMLSelectElement)) {
            return;
        }
        this.selectedChange.emit(option.value || '');
    }
}
