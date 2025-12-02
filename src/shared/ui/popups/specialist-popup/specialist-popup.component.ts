import { ChangeDetectionStrategy, Component, computed, ElementRef, Input, input, InputSignal, OnInit, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { PositionsTableItem } from '@entities/speciality';
import { DefaultAvatarIconComponent } from '@icons/default-avatar-icon/default-avatar-icon.component';
import { SearchInputComponent } from '@ui/form/search-input/search-input.component';
import { ActionsWrapperComponent, TActionsWrapper } from '@ui/wrappers/actions-wrapper';
import { LoupeIconComponent } from '@icons/loupe-icon/loupe-icon.component';
import { SpecialistPopupTypesClass } from '@ui/popups/specialist-popup/types/specialist-popup.types';
import { additionalPopupAnimation } from '@lib/helpers/animations';
import { timer } from 'rxjs';

@Component( {
    selector: 'bsm-specialist-popup',
    imports: [ ActionsWrapperComponent, DefaultAvatarIconComponent, SearchInputComponent, LoupeIconComponent ],
    templateUrl: './specialist-popup.component.html',
    styleUrl: './specialist-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [ additionalPopupAnimation ]
} )
export class SpecialistPopupComponent implements OnInit {
    parentEl: InputSignal<HTMLElement> = input.required();
    @Input() options: WritableSignal<PositionsTableItem[]> = signal( [] );
    @Input() selectedOption: WritableSignal<string> = signal( '' );
    @Input() public searchTerm: WritableSignal<string> = signal( '' );
    @Input() public texts: SpecialistPopupTypesClass = new SpecialistPopupTypesClass();
    public closeModal: OutputEmitterRef<void> = output();
    protected animationState: 'void' | '*' = 'void';

    actionsWrapper(): TActionsWrapper {
        return {
            cancel: this.texts.wrapperTexts.closeButton,
            confirm: this.texts.wrapperTexts.successButton,
            label: this.texts.wrapperTexts.label,
        };
    }

    onCloseModal(): void {
        this.animationState = 'void';
        timer( 450 ).subscribe( () => {
            this.closeModal.emit();
        } );
    }

    ngOnInit(): void {
        this.animationState = '*';
    }

    onSelectOption( selectOption: PositionsTableItem ): void {
        this.selectedOption.set( selectOption.getId() );
        this.onCloseModal();
    }

    public onSearchServices( searchTerm: string ): void {
        this.searchTerm.set( searchTerm.trim().toLowerCase() );
    }
}
