import { WritableSignal } from "@angular/core"

export type TCheckboxCardGroup = {
    id: string,
    label: string,
    items: TCheckboxCardItem[],
    groups?: TCheckboxCardGroup[];
    selectedItems?: WritableSignal<string[]>
    selected?: WritableSignal<string>,
    hidden?: WritableSignal<boolean>,
}

export type TCheckboxCardItem = {
    id: string,
    label: string,
    duration: string,
    price: string,
    currency: string,
    selected: WritableSignal<string>,
    hidden?: WritableSignal<boolean>,
    disabled?: WritableSignal<boolean>,
}
