import { inject, Injectable } from '@angular/core';
import { SuccessInformationPopupComponent } from './success-information-popup.component';
import { TViolations } from './violations.types';
import { DefaultPopup } from '@lib/helpers/base-ae/default-popup.class';
import { ValidationPopupsService } from '@lib/services/validation';

@Injectable({
    providedIn: 'root'
})
export class SuccessInformationPopupService extends DefaultPopup<SuccessInformationPopupComponent> {
    public validationPopupsService: ValidationPopupsService = inject(ValidationPopupsService);
    constructor() {
        super('success-information-popup-ae', SuccessInformationPopupComponent);
    }

    setupVariables(violations: TViolations | null, isSuccess: boolean, lifeTime: number, message?: string): void {
        if (!this.popupEl) {
            throw new Error('Popup element not found');
        }
        this.popupEl.isSuccess = isSuccess;
        this.popupEl.animationState = 'void';
        this.popupEl.lifeTime = lifeTime;
        this.popupEl.message = message;

        violations && this.validationPopupsService.setViolations(violations);

        this.popupEl.addEventListener('closeModal', () => {
            this.hide();
        });
    }
}
