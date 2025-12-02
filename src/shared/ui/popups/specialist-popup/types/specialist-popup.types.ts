export type TSpecialistPopup = {
    wrapperTexts: TSpecialistWrapperText,
    emptyStateTexts: TEmptyState
}

export type TEmptyState = {
    title: string,
    placeholder: string
    button?: string
}
export type TSpecialistWrapperText = {
    closeButton: string,
    successButton: string,
    label: string,
    icon?: string
}

export class SpecialistPopupTypesClass {
    public wrapperTexts: TSpecialistWrapperText = {
        closeButton: '',
        successButton: '',
        label: '',
    };
    public emptyStateTexts: TEmptyState = {
        title: '',
        placeholder: '',
        button: '',
    };
    public icon: string = '';

    constructor( options?: TSpecialistPopup ) {
        if ( options ) {
            this.wrapperTexts = options.wrapperTexts || this.wrapperTexts;
            this.emptyStateTexts = options.emptyStateTexts || this.emptyStateTexts;
        }
    }
}
