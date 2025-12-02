import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@i18n/translate.pipe';
import {
    SuccessInfoErrorIconComponent
} from '@icons/success-info-error-icon';
import {
    SuccessInfoSuccessIconComponent
} from '@icons/success-info-success-icon';
import { TextComponent } from '@ui/text';
import { Subject, takeUntil, timer } from 'rxjs';

@Component( {
    selector: 'beauty-information-popup',
    imports: [
        TranslatePipe,
        SuccessInfoErrorIconComponent,
        SuccessInfoSuccessIconComponent,
        TextComponent
    ],
    templateUrl: './information-popup.component.html',
    styleUrl: './information-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class InformationPopupComponent implements OnInit {
    @Input() isSuccess: boolean = false;
    @Input() lifeTime: number | undefined;
    @Input() title: string | undefined;
    @Input() description: string | undefined;
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
    private subj: Subject<void> = new Subject;

    constructor(
        private destroyRef: DestroyRef,
    ) {
    }

    ngOnInit() {
        timer( this.lifeTime || 0 ).pipe( takeUntilDestroyed( this.destroyRef ), takeUntil( this.subj ) ).subscribe( () => {
            this.closeModal.emit();
        } );
    }

    @HostListener( 'touchend', ['$event'] ) onHostClick( ev: TouchEvent ): void {
        this.closeModal.emit();
    }
}
