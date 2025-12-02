import { SelectOption } from "@lib/types/SelectOption.class";

export type TDiscountSelectOption = SelectOption<string, { discountPercent?: number, discountAmount?: number; }>;