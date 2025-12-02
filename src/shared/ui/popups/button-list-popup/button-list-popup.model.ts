import { SelectOption } from "@lib/types/SelectOption.class";

export class ButtonListPopupModel extends Set<SelectOption<string, any>>  {

}

export type ButtonListPopupModelOptionMetadata = {
    callback: Function;
}
