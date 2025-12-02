import { Moment } from "moment";
import { monthsGenitive } from "./const";

export function getGenitiveOrFormattedMonth(date: Moment): string | undefined {
    return [4, 5, 6].includes(date.month()) ? monthsGenitive.get(date.month()) : date.format('MMM');
}