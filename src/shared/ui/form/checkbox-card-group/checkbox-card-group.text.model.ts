
export class CheckboxCardGroupTextModel {
    selectedAll: string = "";
    countInGroup: string = "";
    totalSelected: string = "";
    colums: {
        service: string,
        duration: string
    } = {
        service: "",
        duration: ""
    };
    emptyState: {
        services: string,
        goods: string
    } = {
        services: '',
        goods: ''
    }
    saveButton: string = "";
    header: string = "";
    search_placeholder: string = "";
    other: {[key: string]: string} = {};
    isGroupCheckboxVisible: boolean = true;
    isGroupCountVisible: boolean = true;
    isMobileGroupCheckbox: boolean = false;
}
