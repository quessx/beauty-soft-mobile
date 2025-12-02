import { FormArray, FormControl } from '@angular/forms';

export type TValidationPopupsFormControls = {
    [controlName: string]: FormControl | FormArray;
}
