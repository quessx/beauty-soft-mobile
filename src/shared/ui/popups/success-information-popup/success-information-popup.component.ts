import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input, OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { LanguageService } from '@i18n/language.service';
import { langData } from './success-information-lang';
import { TranslatePipe } from '@i18n/translate.pipe';
import {
    SuccessInfoErrorIconComponent
} from '@icons/success-info-error-icon';
import {
    SuccessInfoSuccessIconComponent
} from '@icons/success-info-success-icon';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'beauty-success-information-popup',
    imports: [
        TranslatePipe,
        SuccessInfoErrorIconComponent,
        SuccessInfoSuccessIconComponent
    ],
    templateUrl: './success-information-popup.component.html',
    styleUrl: './success-information-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('showPopup', [
            state('void', style({ bottom: '-85px', opacity: 0 })),
            state('*', style({ bottom: '10px', opacity: 1 })),
            transition('void <=> *', animate('0.5s ease-in-out')),
        ]),
    ],
})
export class SuccessInformationPopupComponent implements OnInit, OnDestroy {
    @Input() isSuccess: boolean = false;
    @Input() parentElRef: ElementRef | undefined = undefined;
    @Input() lifeTime: number | undefined;
    @Input() message: string | undefined;

    textInfo: string = '';
    @Input() animationState = 'void';
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

    private hideModalTimeout: NodeJS.Timeout | null | undefined;

    constructor(private elementRef: ElementRef) {
        LanguageService.setLangData(langData[LanguageService.getLangStatic()]);
    }

    ngOnInit() {
        this.animationState = '*';
        if (this.message) {
            this.textInfo = this.message;
        } else {
            this.textInfo = this.isSuccess ? 
                LanguageService.translate('success_info.success') : 
                LanguageService.translate('success_info.error');
        }

        if (this.lifeTime != null && this.lifeTime > 0) {
            this.hideModalTimeout = setTimeout(() => {
                this.hideModal();
            }, this.lifeTime);
        }
    }

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement: HTMLElement): void {
        let clickedInside: boolean = this.elementRef.nativeElement.contains(targetElement);
        if (clickedInside) {
            this.clearHideTimeout();
            this.hideModal();
        }
    }

    hideModal() {
        this.animationState = 'void';
        setTimeout(() => {
            this.closeModal.emit();
        }, 550);
    }

    ngOnDestroy() {
        this.clearHideTimeout();
    }

    private clearHideTimeout() {
        if (this.hideModalTimeout) {
            clearTimeout(this.hideModalTimeout);
            this.hideModalTimeout = null;
        }
    }
}
