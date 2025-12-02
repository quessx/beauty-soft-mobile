import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { objectGet } from './shared.functions';
import { SupportedLanguage, TLangData, TSupportedLanguage } from './lang.types';
import { generalLangData } from './general.lang';

const LANGUAGE_CACHE_LIFETIME: number = 3600;
@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private readonly urlPrefix = '/assets/locale-';
    private static lang: TSupportedLanguage = 'ru';
    private static staticLangData = {};
    private langDataLoaded$ = new Subject<object>();

    constructor() {
        this.setLang(LanguageService.detectLanguage());
    }

    static detectLanguage(): TSupportedLanguage {
        //Для тестирования
        if(localStorage && localStorage.getItem('language')) {
            let lang: string = localStorage.getItem('language') || 'ru';
            return SupportedLanguage[lang as TSupportedLanguage];
        }

        //В некоторых браузерах там лежит, то что ожидается (ru, en), а в некоторых (ru-RU, en-US)
        let navigatorLanguage: TSupportedLanguage = (navigator.language.split('-')[0]) as TSupportedLanguage;
        if (!!SupportedLanguage[navigatorLanguage]) {
            return SupportedLanguage[navigatorLanguage];
        }

        return SupportedLanguage.ru;
    }

    setLang(lang: TSupportedLanguage): void {
        LanguageService.lang = lang;
        LanguageService.setLangData(generalLangData[lang]);
    }

    getLang(): TSupportedLanguage {
        return LanguageService.lang;
    }

    public static getLangStatic(): TSupportedLanguage {
        return LanguageService.lang;
    }

    public static getDataStatic(): any {
        return LanguageService.staticLangData;
    }

    langDataLoaded(): Observable<object> {
        return this.langDataLoaded$.asObservable();
    }

    getData(): object {
        return LanguageService.staticLangData;
    }

    private static _translate(data: object, path: string, masks: {[id: string]: any}): string
    {
        let result: string = objectGet(data, path, path);
        Object.keys(masks).forEach((key: string) => {
            result = result.replaceAll('{{'+key+'}}', masks[key]);
        });
        if (result.toString() === '[object Object]') {
            result = path;
        }
        return result;
    }

    translate(path: string, masks: object = {}): string {
        path = path.replace('{{', '').replace('}}', '');
        return LanguageService._translate(this.getData(), path, masks);
    }

    public static setLangData(data: TLangData): void {
        LanguageService.staticLangData = Object.assign(LanguageService.staticLangData, data);
    }
    static translate(path: string, masks: object = {}): string {
        path = path.replace('{{', '').replace('}}', '');
        return LanguageService._translate(LanguageService.staticLangData, path, masks);
    }

    private static _splitNumeral(data: object, path: string): string[] {
        let values: string[] = objectGet(data, path, path).split(',');
        if(values.length >= 3) {
            return values;
        } else {
            return [path, path, path];
        }
    }

    splitNumeral(path: string): string[] {
        return LanguageService._splitNumeral(this.getData(), path);
    }

    static splitNumeral(path: string): string[] {
        return LanguageService._splitNumeral(LanguageService.staticLangData, path);
    }

    private static _numeral(numerals: string, number: number): string {
        let parts = numerals.split(',');
        if(parts.length < 3) {
            return numerals;
        }

        //Приведение к формату [1, *1, *2-*4, *5-*0]
        let parsedParts: string[] = [];
        if(parts.length >= 4){
            parsedParts = parts;
        } else if(parts.length == 3){
            parsedParts = [parts[0], parts[0], parts[1], parts[2]];
        }

        if(number == 1){
            return parsedParts[0]; //1
        } else if(Math.floor(number) != number){
            return parsedParts[3]; //дробные
        } else if(number % 100 >= 11 && number % 100 <= 14){
            return parsedParts[3]; //*11-*14
        } else if((number % 10 > 1 && number % 10 <= 4)){
            return parsedParts[2]; //*2-*4
        } else if(number % 10 == 1){
            return parsedParts[1]; //*1
        } else {
            return parsedParts[3];
        }
    }

    numeral(path: string, number: number, masks: object = {}): string {
        return LanguageService._numeral(this.translate(path, masks), number);
    }

    static numeral(path: string, number: number, masks: object = {}): string {
        return LanguageService._numeral(LanguageService.translate(path, masks), number);
    }
}
