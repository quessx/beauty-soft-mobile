import { Type } from "@angular/core";
import { MenuItem } from "primeng/api";

export interface IMenuItem extends MenuItem {
    isActive?: boolean;
    iconComponent?: Type<unknown>;
    items?: IMenuItem[];
}