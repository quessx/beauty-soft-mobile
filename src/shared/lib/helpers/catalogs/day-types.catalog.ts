import { LanguageService } from "@i18n/language.service";
import { ButtonListPopupModel } from "@ui/popups/button-list-popup/button-list-popup.model";
import { DayTypesCatalogTypes } from "./day-types-catalog.types";
import { SelectOption } from "@lib/types/SelectOption.class";

export class DayTypesCatalog {

    constructor() {
    }

    static getAsButtonListPopupModel(filter: DayTypesCatalogTypes.DayTypesCatalogEnum[] = []): ButtonListPopupModel {
        const options: SelectOption[] = [];
        Object.values(DayTypesCatalogTypes.DayTypesCatalogEnum).forEach((day, index) => {
            if (filter.includes(day)) {
                return;
            }
            options.push(new SelectOption<string, {preItem: string}>({
                id: day,
                value: day,
                label: LanguageService.translate(`employee_schedule_page_front.schedule_settings_modal.inputs.type.options.${day}`),
                metadata: {
                    preItem: `content: url("assets/days-icon/${day}.svg")`
                }
            }));
        });
        return new ButtonListPopupModel(options);
    }
}