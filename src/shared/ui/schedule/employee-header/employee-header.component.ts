import { ChangeDetectionStrategy, Component, input, Input, InputSignal } from '@angular/core';
import { ResourceApi } from '@fullcalendar/resource/index.js';
import { UserImageComponent } from 'beauty-soft-common';
import { EmployeeResourceModel } from '@lib/types/employee-resource';
import { IonSkeletonText, IonThumbnail } from '@ionic/angular/standalone';

@Component({
    selector: 'bsm-employee-header',
    imports: [UserImageComponent, IonSkeletonText, IonThumbnail],
    templateUrl: './employee-header.component.html',
    styleUrl: './employee-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeHeaderComponent {
    @Input() set model(model: ResourceApi) {
        if (!model || !model?.extendedProps || !model?.extendedProps?.['self']) {
            return;
        }
        this.employeeModel = model.extendedProps['self'];
    };
    isLoading: InputSignal<boolean> = input(true);
    public employeeModel: EmployeeResourceModel | undefined = undefined;
}
