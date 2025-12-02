import { ChangeDetectionStrategy, Component, computed, viewChild, effect, EventEmitter, Input, Output, Signal, signal, WritableSignal, AfterViewInit, ViewChildren, QueryList, viewChildren, OnInit, } from '@angular/core';
import { MatCheckbox, MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { CheckboxCardGroupTextModel } from './checkbox-card-group.text.model';
import { TranslatePipe } from '@i18n/translate.pipe';
import { CdkAccordionModule, CdkAccordionItem } from '@angular/cdk/accordion';
import { ExpendableIconComponent } from '@icons/expendable-icon/expendable-icon.component';
import { CheckboxCardGroupModel } from './checkbox-card-group.model';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { TCheckboxCardGroup, TCheckboxCardItem } from '@ui/form/checkbox-card-group/checkbox-card-group.types';
import { AmountComponent } from "@ui/formatters/amount/amount.component";
import { DurationPipe } from '@lib/helpers/pipes/duration.pipe';
import { timer } from 'rxjs';

@Component( {
    selector: 'beauty-checkbox-card-group',
    imports: [ MatCheckboxModule, TranslatePipe, CdkAccordionModule, ExpendableIconComponent, NgClass, MatDividerModule, DurationPipe, AmountComponent, NgTemplateOutlet ],
    templateUrl: './checkbox-card-group.component.html',
    styleUrl: './checkbox-card-group.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class CheckboxCardGroupComponent implements OnInit, AfterViewInit {
    @Input( { required: true } ) texts: CheckboxCardGroupTextModel = new CheckboxCardGroupTextModel();

    @Input() set model( model: CheckboxCardGroupModel ) {
        this.modelSignal.set( model );
    };

    @Input() modelSignal: WritableSignal<CheckboxCardGroupModel> = signal( new CheckboxCardGroupModel( [] ) );
    @Input() searchTerm: WritableSignal<string> = signal( '' );
    @Input() multi: boolean = false;
    @Input() isOpenFirstGroup: boolean = false;
    @Output() change: EventEmitter<string[]> = new EventEmitter<string[]>();

    @ViewChildren( 'accordionItem' ) accordionItems!: QueryList<CdkAccordionItem>;

    constructor() {
        effect( () => {
            this.change.emit( this.modelSignal().totalSelected() );
        } );
    }

    ngOnInit(): void {
        this.expandFirst();
    }

    expandFirst(): void {
        if ( !this.isOpenFirstGroup ) {
            return;
        }
        const expandItems: () => void = (): void => {
            const first: CdkAccordionItem = this.accordionItems?.first;
            if ( first ) {
                try {
                    first.expanded = true;
                } catch ( e ) {
                    console.error( e );
                    try {
                        ( first as any ).toggle();
                    } catch ( err ) {
                        console.error( err );
                    }
                }
            }
        }

        timer( 0 ).subscribe( () => {
            expandItems();
        } );
    }

    ngAfterViewInit(): void {
        timer( 10 ).subscribe( () => {
            const firstItemGroup: CdkAccordionItem | undefined = this.accordionItems.get( 2 );
            if ( firstItemGroup ) {
                firstItemGroup.expanded = true;
            }
        } )
    }

    public filteredGroups: Signal<TCheckboxCardGroup[]> = computed(() => {
        return this.modelSignal().getItems().filter((group: TCheckboxCardGroup) => {
            if(group.items.length > 0) {
                const groupMatches: boolean = group.label.toLowerCase().includes(this.searchTerm().toLowerCase());
                const itemsMatches: boolean = group.items.some((item: TCheckboxCardItem) =>
                    item.label.toLowerCase().includes(this.searchTerm().toLowerCase())
                );
                return groupMatches || itemsMatches;
            } else {
                return true;
            }
        });
    })

    getEmptyText(group: TCheckboxCardItem): string | undefined {
        return this.texts.emptyState?.[group.id as 'services' | 'goods'] || undefined;
    }

    getFilteredItems( items: TCheckboxCardItem[] ): TCheckboxCardItem[] {
        if ( !this.searchTerm() ) {
            return items;
        }
        return items.filter( ( item: TCheckboxCardItem ) =>
            item.label.toLowerCase().includes( this.searchTerm().toLowerCase() )
        );
    }

    onChange( $event: MatCheckboxChange, group: TCheckboxCardGroup, item: TCheckboxCardItem ): void {
        this.modelSignal().updateItem( $event.checked, group.id, item.id );
    }

    getGroups( group: TCheckboxCardGroup ): TCheckboxCardGroup[] {
        return group.groups ?? [];
    }

    onRowClick( ref: MatCheckbox ): void {
        ref._inputElement.nativeElement.click();
    }
}
