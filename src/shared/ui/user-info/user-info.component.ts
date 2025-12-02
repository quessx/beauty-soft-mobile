import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputSearchTypeComponent } from '@ui/form/input-search-type';
import { ItemGroupComponent } from '@ui/templates/item-group';
import { RowComponent } from '@ui/templates/row';
import { TextComponent } from '@ui/text';

@Component( {
    selector: 'bsm-user-name',
    imports: [
        ReactiveFormsModule,
        TextComponent,
        InputSearchTypeComponent,
        ItemGroupComponent,
        RowComponent
    ],
    templateUrl: './user-info.component.html',
    styleUrls: [ './user-info.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class UserInfoComponent {
    public formGroup: InputSignal<FormGroup> = input.required();
    public firstNameControlName: InputSignal<string> = input.required();
    public lastNameControlName: InputSignal<string> = input.required();

    public firstNamePlaceholder: InputSignal<string> = input<string>( '' );
    public lastNamePlaceholder: InputSignal<string> = input<string>( '' );
    public helperText: InputSignal<string> = input<string>( '' );

    public onClearSearch( field: string ): void {
        this.formGroup().get( field )?.reset();
    }
}
