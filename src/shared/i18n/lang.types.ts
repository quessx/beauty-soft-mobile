
export type LanguageCache = {
    data: TLangData,
    lang: SupportedLanguage,
    updated_at: number,
    version: string
}

export type TSupportedLanguage = 'ru';

export enum SupportedLanguage {
    ru = 'ru',
    // en = 'en',
    // es = 'es',
    // pt = 'pt'
}

export type TLangData = {
    [key: string]: string | TLangData
}

export type TLangObject = {[lang in TSupportedLanguage]: TLangData};