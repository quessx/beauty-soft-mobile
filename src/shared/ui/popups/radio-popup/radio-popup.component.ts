import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnInit, Output, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectOption } from '@lib/types/SelectOption.class';
import { TextComponent } from '@ui/text';
import { RadioGroupComponent } from '@ui/form-elements/radios/radio-group';
import { ActionsWrapperComponent } from '@ui/wrappers/actions-wrapper';

@Component({
    selector: 'bsm-radio-popup',
    imports: [ActionsWrapperComponent, RadioGroupComponent, ReactiveFormsModule, TextComponent],
    templateUrl: './radio-popup.component.html',
    styleUrl: './radio-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioPopupComponent implements OnInit {
    @Input() selected?: WritableSignal<string>;
    @Input() public centerText: string = '';
    @Input() public entitiesTitle: string = '';
    @Input() public entities: SelectOption[] = [];
    @Output() public closeModal: EventEmitter<void> = new EventEmitter;
    protected control: FormControl<string | null> = new FormControl(null);

    constructor() {
    }

    ngOnInit(): void {
        this.control.setValue(this.selected && this.selected() || null);
    }


    onCancel(): void {
        this.closeModal.emit();
    }

    onConfirm(): void {
        this.selected?.set(this.control.value || this.selected());
        this.closeModal.emit();
    }

    @HostListener('click', ['$event']) onHostClick(ev: Event): void {
        if (ev.target === ev.currentTarget) {
            this.closeModal.emit();
        }
    }
}
