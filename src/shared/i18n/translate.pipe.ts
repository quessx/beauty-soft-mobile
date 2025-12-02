import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from './language.service';

@Pipe({
    name: 'translate',
    standalone: true,
})
export class TranslatePipe implements PipeTransform {

    constructor(private langService: LanguageService) {
    }

    transform(path: any, masks?: any): any {
        return this.langService.translate(path, masks);
    }

}
