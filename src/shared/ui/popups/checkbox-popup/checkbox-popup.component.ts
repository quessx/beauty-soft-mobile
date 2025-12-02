import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, Signal, signal, viewChildren, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TextComponent } from '@ui/text';
import { CheckboxComponent } from '@ui/form-elements/checkboxes/checkbox';
import { ActionsWrapperComponent } from '@ui/wrappers/actions-wrapper';
import { LanguageService, TranslatePipe } from 'beauty-soft-common';
import { langData } from './lang';
import { SelectOptionCheckbox } from './types';

@Component( {
    selector: 'bsm-checkbox-popup',
    imports: [ActionsWrapperComponent, CheckboxComponent, TranslatePipe, ReactiveFormsModule, TextComponent],
    templateUrl: './checkbox-popup.component.html',
    styleUrl: './checkbox-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class CheckboxPopupComponent implements OnInit {
    @Input() public centerText: string = '';
    @Input() public entitiesTitle: string = '';
    @Input() public entities: WritableSignal<SelectOptionCheckbox[]> = signal( [] );
    private _entities: Set<string> = new Set;
    protected isEmptySelection: boolean = false;
    @Output() public closeModal: EventEmitter<void> = new EventEmitter;
    private checkboxes: Signal<readonly CheckboxComponent[]> = viewChildren( CheckboxComponent );

    constructor( private elementRef: ElementRef<HTMLElement> ) {
        LanguageService.setLangData( langData[LanguageService.getLangStatic()] );
    }

    ngOnInit(): void {
        this._entities = new Set(
            structuredClone( this.entities()
                .filter( ( entity: SelectOptionCheckbox ) => entity.metadata?.checked )
                .map( ( entity: SelectOptionCheckbox ) => entity.id ) )
        );
    }

    closeWithPreservedData(): void {
        const clone: SelectOptionCheckbox[] = structuredClone( this.entities() );
        this.entities.set( clone );
        this.closeModal.emit();
    }

    onCancel(): void {
        this.closeWithPreservedData();
    }

    onConfirm(): void {
        const clone: SelectOptionCheckbox[] = structuredClone( this.entities() );
        this.entities.set( clone.map( ( entity: SelectOptionCheckbox ) => {
            return {
                ...entity,
                metadata: {
                    ...entity.metadata,
                    checked: this._entities.has( entity.id )
                }
            };
        } ) );
        this.closeModal.emit();
    }

    onSelection(): void {
        if ( !this.isEmptySelection ) {
            this.checkboxes().forEach( ( checkbox: CheckboxComponent ) => {
                checkbox.handleChange( false );
            } );
        } else {
            this.checkboxes().forEach( ( checkbox: CheckboxComponent ) => {
                checkbox.handleChange( true );
            } );
        }
    }

    onCheckedChange( entityId: string, isChecked: boolean ): void {
        if ( isChecked ) {
            this._entities.add( entityId );
        } else {
            this._entities.delete( entityId );
        }

        this.checkEmptySelect();
    }

    checkEmptySelect(): void {
        this.isEmptySelection = !this._entities.size;
    }
}
