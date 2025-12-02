import { TRangeDate, TRangeString } from "@lib/types/range";
import moment, { Duration, Moment } from "moment";

export class ScheduleDateHelper {
    static isValidDate(d: any): boolean {
        return d instanceof Date && isFinite(d.getDate());
    }

    static getCurrentWeek(currentDate: Date): TRangeDate {
        if (!ScheduleDateHelper.isValidDate(currentDate)) {
            currentDate = new Date();
        }
        // Получаем текущий день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
        const dayOfWeek: number = currentDate.getDay();

        // Вычисляем сколько дней нужно вычесть для получения понедельника
        const mondayOffset: number = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Если воскресенье, то вычитаем 6
        const sundayOffset: number = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // Для нахождения воскресенья

        const monday: Date = new Date(currentDate);
        monday.setDate(currentDate.getDate() + mondayOffset); // Устанавливаем понедельник

        const sunday: Date = new Date(currentDate);
        sunday.setDate(currentDate.getDate() + sundayOffset); // Устанавливаем воскресенье

        return {
            from: monday,
            to: sunday
        };
    }

    static getCurrentWeekDays(currentDate?: Date): Date[] {
        const week: TRangeDate = ScheduleDateHelper.getCurrentWeek(currentDate || new Date());
        const days: Date[] = [];
        let currentDateIterator: Date = new Date(week.from);

        for (let i: number = 0; i < 7; i++) {
            days.push(new Date(currentDateIterator)); // Создаем новый Date объект, чтобы избежать проблем с ссылками
            currentDateIterator.setDate(currentDateIterator.getDate() + 1);
        }

        return days;
    }

    static getWeekAfterDate(currentDate: Date = new Date()): Date[] {
        const days: Date[] = [];
        let currentDateIterator: Date = new Date(currentDate);

        for (let i: number = 0; i < 7; i++) {
            days.push(new Date(currentDateIterator)); // Создаем новый Date объект, чтобы избежать проблем с ссылками
            currentDateIterator.setDate(currentDateIterator.getDate() + 1);
        }

        return days;
    }

    static calculateTimeDifference(timeObject: TRangeString): Duration {
        const startTime: Moment = moment(timeObject.from, 'HH:mm');
        const endTime: Moment = moment(timeObject.to, 'HH:mm');
        const difference: Duration = moment.duration(endTime.diff(startTime));
        return difference;
    }

    static getDateWithWeekToggleAndMinDate(inputDate: Date, addWeek: boolean, preventPast: boolean): Date {
        // Создаем новые объекты Date, чтобы не изменять исходные даты
        const futureDate: Date = new Date(inputDate);
        futureDate.setHours(0, 0, 0, 0);
        const today: Date = new Date();
        today.setHours(0, 0, 0, 0); // Обнуляем время для корректного сравнения
        const daysInWeek: number = 7;

        if (addWeek) {
            futureDate.setDate(inputDate.getDate() + daysInWeek);
        } else {
            futureDate.setDate(inputDate.getDate() - daysInWeek);
        }

        if (preventPast && futureDate < today) {
            return today;
        }

        return futureDate;
    }
}