import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

export const additionalPopupAnimation: AnimationTriggerMetadata =
    trigger( 'showPopup', [
        state( 'void', style( { transform: 'translateX(100%)' } ) ),
        state( '*', style( { transform: 'translateX(0%)' } ) ),
        transition( 'void <=> *', animate( '0.5s ease-in-out' ) ),
    ] )

