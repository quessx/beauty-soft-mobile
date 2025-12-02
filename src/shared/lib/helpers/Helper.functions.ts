import { AppointmentJsonldAppointmentRead, GoodSaleJsonldGoodSaleRead } from "@api/index";
import moment from "moment";
import { TuiTime } from '@taiga-ui/cdk';
import { TOptsTick } from '@lib/helpers/definitions';

export class Helper {
    static getUIDFromAtId(str: string = ''): string {
        let match = (str || '').match(/([^\/]+)$/); // Находим последний сегмент после последнего слэша
        return match ? match[0] : '';
    }

    static timeFormatNumber(input: number | string): string {
        if (!(typeof input === 'number' || !isNaN(Number(input)))) {
            throw new Error('Invalid input: must be a number or a string that can be converted to a number.');
        }
        const toStringInput: string = input + '';
        if (toStringInput.length < 2) {
            return `0${toStringInput}`;
        }
        return toStringInput;
    }

    static ddMmyyyyToIsoWithMoment(dateString: string): moment.Moment {
        const parts: string[] = dateString.split('/');
        const day: number = Number(parts[0]);
        const month: number = Number(parts[1]) - 1;
        const year: number = Number(parts[2]);

        const date: moment.Moment = moment(new Date(year, month, day));
        return date;
    }

    static formatTimeHourAndMinutes(time: string): string {
        if (time.length <= 5) {
            return time;
        }
        return time.slice(0, 5);
    }

    static stringToTuiTime = (timeStr: string): TuiTime => {
        const [hours, minutes]: number[] = timeStr.split(':').map(Number);
        return new TuiTime(hours, minutes);
    };

    static normalizeTime(timeStr: string): string {
        /**
         * Проверяет, соответствует ли время периоду в полчаса, и приводит его к ближайшему периоду.
         *
         * @param {string} timeStr Строка с временем в формате "HH:MM:SS".
         * @returns {string} Строка с нормализованным временем.
         */
        const timeRegex: RegExp = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
        if (!timeRegex.test(timeStr)) {
            return "Неверный формат времени";
        }

        const [hours, minutes, seconds] = timeStr.split(":").map(Number);

        let normalizedMinutes: number;
        let normalizedHours: number = hours;

        if (minutes < 15) {
            normalizedMinutes = 0;
        } else if (minutes < 45) {
            normalizedMinutes = 30;
        } else {
            normalizedMinutes = 0;
            normalizedHours = (hours + 1); // Обработка перехода на следующий день
        }

        const normalizedTime: string = `${String(normalizedHours).padStart(2, "0")}:${String(normalizedMinutes).padStart(2, "0")}:00`;
        return normalizedTime;
    }

    static symbolCurrency(currency: string): string {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currencyDisplay: 'symbol',
            currency: currency
        }).formatToParts(0).find(part => part.type === "currency")?.value || '';
    }
    /**
     *
     * @param multiply - prepare amount to post/patch
     */
    static transformFixedAmount(amount: string | number | undefined, multiply: boolean = false): string | undefined {
        const amountCf: number = 100;
        const _amount: number | undefined = Number(amount);
        return isNaN(_amount) ? undefined : (multiply ? Math.round(_amount * amountCf) : (_amount / amountCf)).toString();
    }

    static processObject(obj: any): void {
        if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    if (key === 'amount') {
                        // Предполагаем, что Helper и transformFixedAmount доступны в текущей области видимости
                        obj[key] = Helper.transformFixedAmount(obj[key]);
                    } else if (typeof obj[key] === 'object') {
                        Helper.processObject(obj[key]); // Рекурсивный вызов для вложенных объектов
                    }
                }
            }
        }
    }

    static transformAppointmentsFixedAmount(appointments: AppointmentJsonldAppointmentRead[]): AppointmentJsonldAppointmentRead[] {
        appointments.forEach((it) => {
            Helper.processObject(it);
        });
        return appointments;
    }
    static transformGoodSaleFixedAmount(goodSale: GoodSaleJsonldGoodSaleRead[]): GoodSaleJsonldGoodSaleRead[] {
        goodSale.forEach((it) => {
            Helper.processObject(it);
        });
        return goodSale;
    }

    static convertTimeToShortFormat(timeString: string): string {
        const parts: string[] = timeString.split(':');
        if (parts.length >= 2) {
            return `${parts[0]}:${parts[1]}`;
        }
        return timeString; // Return original if format is unexpected
    }

    static async systemHapticTick(opts?: TOptsTick): Promise<void> {
        try {
            if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
                const pattern: number[] = opts === 'heavy' ? [30] : opts === 'medium' ? [20] : [10];
                navigator.vibrate(pattern);
            }
        } catch (e) {
            // give up silently
            console.error(e);
        }
    }

    static uniqueArrByField<T>(arr: T[], field: keyof T): T[] {
        let map = new Map<T[keyof T], T>();
        for (let item of arr) {
            if (!map.has(item[field])) {
                map.set(item[field], item);
            }
        }
        return Array.from(map.values());
    }
}
