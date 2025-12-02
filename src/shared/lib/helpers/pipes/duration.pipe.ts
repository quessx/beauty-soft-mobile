import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import { generalLangData as langData } from '@i18n/general.lang';

@Pipe({
    name: 'duration'
})
export class DurationPipe implements PipeTransform {
    constructor() {
        LanguageService.setLangData(langData[LanguageService.getLangStatic()])
    }

    transform(duration: string | number): string {
        const minutes: number = typeof duration === 'string' ? parseInt(duration, 10) : duration;

        if (isNaN(minutes)) {
            return '';
        };
        
        const hours: number = Math.floor(minutes / 60);
        const remainingMinutes: number = minutes % 60;
        
        if (hours === 0) {
            return `${remainingMinutes} ${LanguageService.translate('front_general.time.minute.abbreviation')}`;
        }
        
        return `${hours} ${LanguageService.translate('front_general.time.hour.abbreviation')} ${remainingMinutes} ${LanguageService.translate('front_general.time.minute.abbreviation')}`;
    }
}