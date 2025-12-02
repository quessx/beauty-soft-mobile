import { FormControl } from '@angular/forms';

/**
 * Базовый интерфейс для формы с полями имени и фамилии
 * Может быть расширен в родительском компоненте дополнительными полями
 */
export interface IUserNameForm {
    firstName: FormControl<string>;
    lastName: FormControl<string>;
}
