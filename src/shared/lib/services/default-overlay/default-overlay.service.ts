import { Injectable } from '@angular/core';
import { DefaultOverlayComponent } from './default-overlay.component';
import { DefaultPopup } from '@lib/helpers/base-ae';

@Injectable({
    providedIn: 'root'
})
export class DefaultOverlayService extends DefaultPopup<DefaultOverlayComponent> {
    private isNeedClose: boolean = false;
    private timeout: NodeJS.Timeout | undefined = undefined;

    constructor() {
        super('sensei-default-overlay-ae', DefaultOverlayComponent);
    }
    override setupVariables(...arg: any[]): void {
        
    }

    override show(...arg: any[]): this {
        clearTimeout(this.timeout);
        this.isNeedClose = false;
        super.show(...arg);
        return this;
    }

    override hide(): this {
        clearTimeout(this.timeout);
        this.isNeedClose = true;
        this.timeout = setTimeout(() => {
            if (this.isNeedClose) {
                super.hide();
            }
        });
        return this;
    }
    
}

