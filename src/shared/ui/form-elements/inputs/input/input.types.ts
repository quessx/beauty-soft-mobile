export type TInputTypeIcons = {
    isNeedLoupeIcon?: boolean,
    isNeedRubIcon?: boolean,
    isPercentIcon?: boolean, // Optional, if you need a percent icon
    adaptiveWidth?: boolean,
    iconColor?: string,
    type?: string
}
export class InputTypeClass implements TInputTypeIcons {
    public isNeedLoupeIcon: boolean = false;
    public isNeedRubIcon: boolean = false;
    public isPercentIcon: boolean = false; // Optional, if you need a percent icon
    public adaptiveWidth: boolean = false; // Optional, if you need a percent icon
    public iconColor?: string; // Default color, can be overridden
    public type: string = 'text';

    constructor(options?: TInputTypeIcons) {
        if (options) {
            this.isNeedLoupeIcon = options.isNeedLoupeIcon ?? false;
            this.isNeedRubIcon = options.isNeedRubIcon ?? false;
            this.isPercentIcon = options.isPercentIcon ?? false; // Optional, default is false
            this.adaptiveWidth = options.adaptiveWidth ?? false; // Optional, default is false
            this.iconColor = options.iconColor ?? undefined; // Default color
            this.type = options.type ?? 'text';
        }
    }
}
