import { DestroyRef, inject, WritableSignal } from "@angular/core";
import { BaseAE } from "./base-ae.class";
import { NgElement, WithProperties } from "@angular/elements";
import { fromEvent } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export abstract class DefaultPopup<T> extends BaseAE {
    popupEl: (NgElement & WithProperties<T> | undefined);
    private isOpenSignal: WritableSignal<boolean> | undefined;
    private destroyRef: DestroyRef = inject(DestroyRef);

    override show(...arg: any[]): this {
        if (!!this.popupEl) {
            return this;
        }
        this.popupEl = document.createElement(this.componentName) as any;
        this.setupCloseListener();
        if (this.popupEl instanceof Node) {
            this.setupVariables(...arg);
            this.getParent().appendChild(this.popupEl);
            this.isOpenSignal && this.isOpenSignal.set(true);
        }
        return this;
    }

    override hide(): this {
        if (!this.popupEl) {
            return this;
        }
        this.getParent().removeChild(this.popupEl);
        if (this.isOpenSignal) {
            this.isOpenSignal.set(false);
            this.isOpenSignal = undefined;
        }
        this.popupEl = undefined;
        return this;
    }

    protected setupCloseListener(): void {
        const onNext: (ev: KeyboardEvent) => void = (ev: KeyboardEvent) => {
            if (!!this.popupEl) {
                ev.stopImmediatePropagation();
            }
            if (ev.key === 'Escape' && this.popupEl) {
                this.hide();
            }
        }
        fromEvent(document.body, 'keydown', { capture: true }, (ev: Event) => ev as KeyboardEvent,).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(onNext);

        this.popupEl?.addEventListener('closeModal', () => {
            this.hide();
        });
    }

    public setOnChangeEvent(callback: Function): this {
        if (!this.popupEl) {
            throw Error('need call setOnChangeEvent after show');
        }
        this.popupEl?.addEventListener('onChange', (event: Event) => {
            if (!(event instanceof CustomEvent)) {
                throw Error('event is not CustomEvent');
            }
            callback(event.detail);
        });
        return this;
    }

    abstract setupVariables(...arg: any[]): void

    setIsOpenSignal(isOpen: WritableSignal<boolean>): this {
        this.isOpenSignal = isOpen;
        return this;
    }
}
