import { WritableSignal } from '@angular/core';
import { Helper } from '@lib/helpers/Helper.functions';

export class SignalsHelper {
    public static removeItemByIndex<T>(signal: WritableSignal<T[]>, index: number): void {
        if (index < 0 || index >= signal().length) {
            console.error('Error. The index value is out of the range');
            return;
        }

        signal.update((items: T[]) => {
            return [...items.slice(0, index), ...items.slice(index + 1)];
        });
    }

    public static removeItemByProperty<T, K extends keyof T>(
        signal: WritableSignal<T[]>,
        property: K,
        value: T[K]
    ): void {
        signal.update((items: T[]) => items.filter((item: T) => item[property] !== value));
    }

    public static removeItem<T>(signal: WritableSignal<T[]>, item: T) {
        signal.update((items: T[]) => items.filter(arrItem => arrItem !== item));
    }

    public static unshift<T>(signal: WritableSignal<T[]>, elements: T | T[]): number {
        signal.update((items: T[]) => [...(Array.isArray(elements) ? elements : [elements]), ...items]);
        return signal().length;
    }

    public static shift<T>(signal: WritableSignal<T[]>): T | undefined {
        if (!signal().length) {
            return undefined;
        }

        let element: T = signal()[0];
        signal.update((items: T[]) => items.slice(1));
        return element;
    }

    public static push<T>(signal: WritableSignal<T[]>, elements: T | T[], filterBy?: keyof T): number {
        signal.update((items: T[]) => {
            if (filterBy) {
                return Helper.uniqueArrByField(items.concat(elements), filterBy);
            }
            return [...items, ...(Array.isArray(elements) ? elements : [elements])];
        });
        return signal().length;
    }

    public static pop<T>(signal: WritableSignal<T[]>): T | undefined {
        if (!signal().length) {
            return undefined;
        }

        let lastElement: T | undefined = signal().at(-1);
        signal.update((items: T[]) => items.slice(0, -1));
        return lastElement;
    }

    public static patchState<T extends object | null>(
        signal: WritableSignal<T>,
        updaters: Partial<Record<keyof T, T[keyof T]>>
    ): void {
        signal.update((item: T) => ({ ...item, ...updaters }));
    }

    public static patchStateInArray<T, K extends keyof T>(
        signal: WritableSignal<T[]>,
        property: K,
        value: T[K],
        updaters: Partial<Record<keyof T, T[keyof T]>>
    ): void {
        signal.update((items: T[]) => {
            let index: number = items.findIndex(message => message[property] === value);
            if (index !== -1) {
                items[index] = { ...items[index], ...updaters };
            }
            return [...items];
        });
    }
}
