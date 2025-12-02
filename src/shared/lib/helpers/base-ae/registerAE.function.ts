import { Injector } from "@angular/core";
import { createCustomElement } from "@angular/elements";

export function registerAE(componentName: string, componentClass: any, injector: Injector): void {
    if (!customElements.get(componentName)) {
        const customElement = createCustomElement(componentClass, {injector});
        customElements.define(componentName, customElement);
    }
}