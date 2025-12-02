
export class EmployeeScheduleSettingsHelper {
    static getDayDeclension(dayOfWeek: string): string {
        const declensions: Record<string, string> = {
            'понедельник': 'каждый',
            'вторник': 'каждый',
            'среда': 'каждую',
            'четверг': 'каждый',
            'пятница': 'каждую',
            'суббота': 'каждую',
            'воскресенье': 'каждое'
        };
        return declensions[dayOfWeek.toLowerCase()] || 'каждый';
    }

    static getAccusativeDayOfWeek(dayOfWeek: string): string
    static getAccusativeDayOfWeek(dayOfWeek: number, isAngWeek: boolean): string
    static getAccusativeDayOfWeek(dayOfWeek: string | number, isAngWeek: boolean = false): string {
        const accusativeForms: Record<string, string> = {
            'пн': 'пн',
            'вт': 'вт',
            'ср': 'ср',
            'чт': 'чт',
            'пт': 'пт',
            'сб': 'сб',
            'вс': 'вс'
        };
        if (typeof dayOfWeek === 'number') {
            let days: string[] = Object.keys(accusativeForms);
            if (!!isAngWeek) {
                const last: string | undefined = days.pop();
                days.unshift(last || '');
            }
            return days[dayOfWeek] || days[0]; 
        }
        const day = dayOfWeek.toLowerCase();
        return accusativeForms[day] || day;
    }
}