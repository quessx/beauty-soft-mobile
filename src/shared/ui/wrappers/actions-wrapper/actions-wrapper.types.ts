export type TActionsWrapper = {
    confirm?: string;
    cancel?: string;
    label?: string;
    icon?: string;
}

export class ActionsWrapperClass implements TActionsWrapper {
    public confirm: string | undefined;
    public cancel: string | undefined;
    public label: string | undefined;
    public icon: string | undefined;

    constructor(options?: TActionsWrapper) {
        if (options) {
            this.confirm = options.confirm ?? this.confirm;
            this.cancel = options.cancel ?? this.cancel;
            this.label = options.cancel ?? this.label;
            this.icon = options.icon ?? this.icon;
        }
    }
}
