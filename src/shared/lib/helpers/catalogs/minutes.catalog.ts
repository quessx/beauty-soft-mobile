import { LanguageService } from "@i18n/language.service";
import { SelectOption } from "@lib/types/SelectOption.class";
import { ButtonListPopupModel } from "@ui/popups/button-list-popup/button-list-popup.model";

export class MinutesCatalog {

    constructor() {
    }

    static getAsButtonListPopupModel(): ButtonListPopupModel {
        const options: SelectOption[] = [];
        for (let i = 0; i <= 55; i += 5) {
            options.push(new SelectOption<string>({ id: i+'', value: i+'', label: i + ' ' + LanguageService.translate(`front_general.time.minute.abbreviation`)}));
        }
        return new ButtonListPopupModel(options);
    }

    static getAsButtonListPopupModelFromHours(timePeriod: number = 5, labelTextFn?: Function, valueTextFn?: Function, idTextFn?: Function): ButtonListPopupModel {
        const options: SelectOption[] = [];
        if (!labelTextFn || (typeof labelTextFn !== 'function')) {
            labelTextFn = (hours: number, minutes: number): string => `${hours} ${LanguageService.translate(`front_general.time.hour.abbreviation`)} ${minutes} ${LanguageService.translate(`front_general.time.minute.abbreviation`)}`;
        }
        if (!valueTextFn || (typeof valueTextFn !== 'function')) {
            valueTextFn = (hours: number, minutes: number): string => ((hours * 60) + minutes) + '';
        }
        if (!idTextFn || (typeof idTextFn !== 'function')) {
            idTextFn = (hours: number, minutes: number): string => hours + '_' + minutes;
        }
        for (let hours = 0; hours <= 23; hours++) {
            for (let minutes = 0; minutes < 60; minutes += timePeriod) {
                options.push(new SelectOption<string>({
                    id: idTextFn(hours, minutes),
                    value: valueTextFn(hours, minutes),
                    label: labelTextFn(hours, minutes)
                }));
            }
        }
        return new ButtonListPopupModel(options);
    }
}
