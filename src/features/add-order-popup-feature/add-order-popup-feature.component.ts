import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { CheckboxCardGroupComponent, CheckboxCardGroupModel, CheckboxCardGroupTextModel, TCheckboxCardGroup } from '@ui/form/checkbox-card-group';
import { TActionsWrapper } from '@ui/wrappers/actions-wrapper';
import { LanguageService } from '@i18n/language.service';
import { langData } from './lang/lang';
import { SearchInputComponent } from '@ui/form/search-input/search-input.component';
import { AddOrderDataService, AddOrderPopupManagerService, AddOrderSelectionService } from '@features/add-order-feature';
import { AddOrderPopupFeatureService } from '@features/add-order-popup-feature/services/add-order-popup-feature.service';
import { IAddOrderPopupStrongInputs } from '@features/add-order-popup-feature/add-order-popup.types';

@Component( {
    selector: 'bsm-add-order-popup-feature',
    imports: [ SearchInputComponent, CheckboxCardGroupComponent ],
    templateUrl: './add-order-popup-feature.component.html',
    styleUrls: [ './add-order-popup-feature.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ AddOrderSelectionService, AddOrderDataService, AddOrderPopupManagerService ]
} )
export class AddOrderPopupFeatureComponent implements OnInit {
    private readonly popupManagerService: AddOrderPopupManagerService = inject( AddOrderPopupManagerService );
    private readonly selectionService: AddOrderSelectionService = inject( AddOrderSelectionService );

    public texts: CheckboxCardGroupTextModel = new CheckboxCardGroupTextModel();
    public model: CheckboxCardGroupModel = new CheckboxCardGroupModel( [] );
    public addOrderPopupFeatureService: AddOrderPopupFeatureService = inject( AddOrderPopupFeatureService );

    public closeModal: OutputEmitterRef<void> = output();
    public saveModal: OutputEmitterRef<void> = output();
    public searchTerm: WritableSignal<string> = signal( '' );
    protected actionsWrapperClass: TActionsWrapper;

    constructor() {
        // Сначала синхронизируем selectedValue из глобального сервиса
        const globalSelectedValue: string[] = this.addOrderPopupFeatureService.selectedValue();
        this.selectionService.selectedValue.set(globalSelectedValue);
        // Затем обновляем индекс
        this.selectionService.updateItemIndex(globalSelectedValue);
        // И строим модель
        this.buildModel();
        LanguageService.setLangData( langData[ LanguageService.getLangStatic() ] );
        this.actionsWrapperClass = {
            cancel: LanguageService.translate( 'add_order_popup.close_button' ),
            confirm: LanguageService.translate( 'add_order_popup.success_button' ),
            label: LanguageService.translate( 'add_order_popup.label_popup' ),
        };
    }

    public onSearchServices( searchTerm: string ): void {
        this.searchTerm.set( searchTerm.trim().toLowerCase() );
    }

    public onChange( event: string[] ): void {
        this.addOrderPopupFeatureService.values.set( event );
    }

    private buildModel(): void {
        const inputs: IAddOrderPopupStrongInputs = this.popupManagerService.buildCheckBoxModel( this.selectionService.servicesData(), this.selectionService.goodsData(), this.selectionService.selectedValue );
        this.texts = inputs.texts;
        this.model = inputs.model;
    }

    ngOnInit(): void {
    }

}
