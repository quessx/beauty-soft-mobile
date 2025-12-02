// Уточняем входные параметры (не используем any)
import { CheckboxCardGroupModel, CheckboxCardGroupTextModel } from '@ui/form/checkbox-card-group';
import { WritableSignal } from '@angular/core';

export interface IAddOrderPopupStrongInputs {
    orderId?: string;
    model: CheckboxCardGroupModel;
    texts: CheckboxCardGroupTextModel;
    selectedValue: WritableSignal<string[]>;
}
