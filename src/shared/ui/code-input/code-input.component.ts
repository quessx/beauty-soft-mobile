import {
    afterRenderEffect,
    AfterRenderRef,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    Injector,
    input,
    output,
    OutputEmitterRef,
    signal,
    Signal,
    viewChild,
    WritableSignal
} from '@angular/core';
import { CodeInputModule } from 'angular-code-input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, Subject, switchMap, take, tap, timer } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'ui-code-input',
    templateUrl: './code-input.component.html',
    styleUrls: ['./code-input.component.scss'],
    imports: [
        CodeInputModule,
        FormsModule
    ],
    host: {
        '[class.invalid]': 'isInvalid()'
    }
})
export class CodeInputComponent {
    public codeCompleted: OutputEmitterRef<string> = output<string>();
    public secondsLeft: OutputEmitterRef<number> = output<number>();
    public retryDelaySeconds = input.required<number>();

    protected isInvalid: WritableSignal<boolean> = signal<boolean>(false);
    protected codeLength: WritableSignal<number> = signal<number>(4);

    private timerTrigger: Subject<void> = new Subject<void>();
    private code: string = ''

    private codeInput: Signal<CodeInputComponent | undefined> = viewChild.required<CodeInputComponent>('codeInput');
    private codeInputRef: Signal<ElementRef<HTMLElement> | undefined> = viewChild('codeInput', { read: ElementRef });

    private destroyRef = inject(DestroyRef);

    constructor() {
        // const effectRef: AfterRenderRef = afterRenderEffect({
        //     read: () => {
        //         const inputs: NodeListOf<HTMLInputElement> | undefined = this.codeInputRef()?.nativeElement.querySelectorAll('input');
        //         if (!inputs) {
        //             return;
        //         }
        //
        //         inputs.forEach((input, index) => {
        //             if (index === this.codeLength() - 1) {
        //                 fromEvent<InputEvent>(input, 'input').pipe(
        //                     debounceTime(50),
        //                     takeUntilDestroyed(this.destroyRef)
        //                 ).subscribe((event: InputEvent) => {
        //                     this.codeCompleted.emit(this.code);
        //                 })
        //             }
        //
        //             fromEvent<KeyboardEvent>(input, 'keydown', { capture: true }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event: KeyboardEvent) => {
        //                 if (event.key === 'Backspace' && inputs.item(index).classList.contains('has-value')) {
        //                     event.stopPropagation();
        //                     inputs.item(index).value = '';
        //                     inputs.item(index).classList.remove('has-value');
        //                     this.onCodeChange();
        //                 }
        //             })
        //         })
        //         effectRef.destroy();
        //     }
        // })

        this.timerTrigger.pipe(
            switchMap(() => {
                return timer(0, 1000).pipe(
                    tap((i: number) => {
                        this.secondsLeft.emit(this.retryDelaySeconds() - i % 60);
                    }),
                    take(this.retryDelaySeconds() + 1)
                )
            }),
            takeUntilDestroyed()
        ).subscribe();
    }

    protected onCodeComplete($event: string): void {
        this.codeCompleted.emit($event);
        // this.code = $event;
    }

    public reset(withInvalidState: boolean = false): void {
        this.codeInput()?.reset();
        this.timerTrigger.next();
        if (withInvalidState) {
            this.isInvalid.set(true);
        }
    }

    public setInvalidState(): void {
        this.isInvalid.set(true);
    }

    protected onCodeChange(): void {
        this.isInvalid.set(false);
    }
}
