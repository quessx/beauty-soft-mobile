import { inject, Injectable } from '@angular/core';
import { DefaultPopup } from '@lib/helpers/base-ae/default-popup.class';
import { ValidationPopupsService } from '@lib/services/validation';
import { InformationPopupComponent } from './information-popup.component';
import { forkJoin, from } from 'rxjs';

@Injectable( {
    providedIn: 'root'
} )
export class InformationPopupService extends DefaultPopup<InformationPopupComponent> {
    public validationPopupsService: ValidationPopupsService = inject( ValidationPopupsService );
    private currentLeaveAnimInProgress: boolean = false;

    constructor() {
        super( 'information-popup-ae', InformationPopupComponent );
    }

    setupVariables( title: string, description: string, isSuccess: boolean, lifeTime: number ): void {
        if ( !this.popupEl ) {
            throw new Error( 'Popup element not found' );
        }
        this.popupEl.title = title;
        this.popupEl.description = description;
        this.popupEl.isSuccess = isSuccess;
        this.popupEl.lifeTime = lifeTime;
    }

    override show( title: string, description: string, isSuccess: boolean, lifeTime: number = 1000 ): this {
        super.show( title, description, isSuccess, lifeTime );
        this.popupEl?.animate( [
            { opacity: 0 },
            { opacity: 1 }
        ], {
            fill: 'forwards',
            duration: 100
        } );

        this.popupEl?.firstElementChild?.animate( [
            { top: 0 },
            { top: 60 }
        ], { duration: 100, fill: 'none' } );

        return this;
    }

    override hide(): this {
        if ( this.currentLeaveAnimInProgress ) {
            return this;
        }

        const parentLeaveAnim: Promise<Animation> | undefined = this.popupEl?.animate( [
            { opacity: 0 }
        ], { duration: 100 } ).finished;
        const childLeaveAnim: Promise<Animation> | undefined = this.popupEl?.firstElementChild?.animate( [
            { top: 0 }
        ], { duration: 100 } ).finished;
        if ( !!parentLeaveAnim && !!childLeaveAnim ) {
            this.currentLeaveAnimInProgress = true;
            forkJoin( [from( parentLeaveAnim ), from( childLeaveAnim )] ).subscribe( {
                complete: () => {
                    this.currentLeaveAnimInProgress = false;
                    super.hide();
                }
            } );
        } else {
            super.hide();
        }

        return this;
    }
}
