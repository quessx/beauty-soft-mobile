import { LanguageService } from "@i18n/language.service";
import { SelectOption } from "@lib/types/SelectOption.class";
import { ButtonListPopupModel } from "@ui/popups/button-list-popup/button-list-popup.model";

export class HoursCatalog {

    constructor() {
    }

    static getAsButtonListPopupModel(): ButtonListPopupModel {
        const options: SelectOption[] = [];
        for (let i = 0; i <= 24; i++) {
            options.push(new SelectOption<string>({ id: i+'', value: i+'', label: i + ' ' + LanguageService.translate(`front_general.time.hour.abbreviation`)}));
        }
        return new ButtonListPopupModel(options);
    }
}