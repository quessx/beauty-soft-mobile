
export function amountFormatted(value: string | number, round: boolean = false, showSign: boolean = false): string {
    const num: number = +(round ? Math.round(+value) : value);
    let formated =  new Intl.NumberFormat('ru', {
        minimumFractionDigits: round ? 0 : 2,
        maximumFractionDigits: round ? 0 : 2,
    }).format(num);

    if (showSign) {
        return (+value > 0) ? `+${formated}` : `−${formated.replace('-', '')}`;
    } else {
        return formated;
    }
}
