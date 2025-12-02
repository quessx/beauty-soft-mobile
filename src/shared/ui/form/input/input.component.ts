import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, Input, input, InputSignal, OnInit, output, OutputEmitterRef, Signal, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, Form, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TTypeInput } from '@ui/form/input/types/input.types';
import { BeautyInputDateComponent } from '@ui/form/beauty-input-date';
// import { InputComponent as UiInputComponent } from '@ui/form-elements';
import { UiInputComponent } from '@ui/form-elements/inputs/ui-input';
import { ButtonListPopupModel } from '@ui/popups';

@Component( {
    selector: 'bsm-input',
    imports: [BeautyInputDateComponent, UiInputComponent],
    templateUrl: './input.component.html',
    styleUrls: [ './input.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef( () => InputComponent ),
            multi: true
        }
    ]
} )
export class InputComponent<T> implements OnInit, ControlValueAccessor {
    private fb: FormBuilder = inject( FormBuilder );

    public typeComponent: InputSignal<TTypeInput> = input.required();

    public disabled: InputSignal<boolean> = input( false );
    public usedMask: InputSignal<string> = input( '' );
    public placeholder: InputSignal<string> = input( '' );
    public options: InputSignal<T | undefined> = input();
    public type: InputSignal<string | null> = input<string | null>('text');
    public autocomplete: InputSignal<string | null> = input<string | null>('off');

    public signalOptions: InputSignal<Signal<ButtonListPopupModel> | undefined> = input();
    public searchClientWithNameSignal: InputSignal<WritableSignal<string> | undefined> = input();

    public onFocus: OutputEmitterRef<FocusEvent> = output();
    public onClosePopup: OutputEmitterRef<void> = output();

    form: FormGroup<{ value: FormControl<string | null> }> = this.fb.group( {
        value: this.fb.control( '' )
    } );

    isDisabled: Signal<boolean | undefined> = computed( () => {
        return this.disabled() ? this.disabled() : undefined;
    } );

    optionsPopup: Signal<ButtonListPopupModel | undefined> = computed(() => {
        const opts: T | undefined = this.options();
        if (opts instanceof ButtonListPopupModel) {
            return opts;
        }
        return undefined
    });

    constructor() {

    }

    clear(): void {
        this.controlForm()?.setValue('');
    }

    private onChange: ( value: string ) => void = () => {
    };
    private onTouched: () => void = () => {
    };

    ngOnInit() {

    }

    protected controlForm(): FormControl<string> {
        return <FormControl>this.form.get( 'value' );
    }

    registerOnChange( fn: any ): void {
        this.onChange = fn;
    }

    registerOnTouched( fn: any ): void {
        this.onTouched = fn;
    }

    writeValue( str: string ): void {
        if ( !( typeof str === 'string' ) ) {
            str = '';
        }
        this.controlForm()?.setValue( str );
    }

    protected readonly ButtonListPopupModel = ButtonListPopupModel;
}
