import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { TViolations } from '@ui/popups/success-information-popup/violations.types';
import { TValidationPopupsFormControls } from './validation-popups.types';

@Injectable( {
    providedIn: 'root'
} )
export class ValidationPopupsService {
    private fb: FormBuilder = inject( FormBuilder );
    private invalidForm: FormGroup = this.fb.group( {
        '': '',
        'phone': ''
    } );

    public setInvalidForm( formControls: TValidationPopupsFormControls ) {
        for ( const control in formControls ) {
            if ( !this.invalidForm.get( control ) ) {
                this.invalidForm.addControl( control, this.fb.control( '' ) );
            }
        }
    }

    public clearErrors(): void {
        this.invalidForm.reset();
    }

    public getInvalidForm(): FormGroup<TValidationPopupsFormControls> {
        return this.invalidForm;
    }

    public hasInvalidValues(): boolean {
        return Object.values( this.invalidForm.value ).some( value => !!value );
    };

    setViolations( violations: TViolations | undefined ): void {
        this.clearErrors();
        if ( !violations ) {
            return;
        }

        for ( const violation of violations ) {
            this.invalidForm.get( violation.propertyPath )?.setValue( violation.message );
        }
    }

    private validatePhones( formControl: FormControl<string[]>, requiredErrorText: string ): boolean {
        let isValid: boolean = true;

        if ( !formControl ) {
            return isValid;
        }
        this.getInvalidForm()?.get( 'phones' )?.setErrors( null );
        const phones: string[] = formControl.value;
        // const invalidPhones: string[] = phones.filter(phone => !phones[0].match('[- +()0-9]{16,17}'));
        const checkIsRequired: string[] = phones.filter( phone => phone.length === 0 );
        if ( checkIsRequired.length > 0 ) {
            this.getInvalidForm()?.get( 'phones' )?.setValue( requiredErrorText );
            isValid = false;
        }

        return isValid;
    }

    public checkInvalidTextForm( formControls: TValidationPopupsFormControls, requiredErrorText: string, maxLengthErrorText?: string, minLengthErrorText?: string ): boolean {
        this.clearErrors();
        let isValid: boolean = true;

        if ( 'phones' in formControls && formControls['phones'] instanceof FormControl ) {
            isValid = this.validatePhones( formControls['phones'], requiredErrorText );
        }
        for ( const control in formControls ) {
            this.getInvalidForm()?.get( control )?.setErrors( null );

            const formControl: TValidationPopupsFormControls[Extract<keyof TValidationPopupsFormControls, string>] = formControls[control];
            if ( formControl.errors ) {
                let errors: ValidationErrors = formControl.errors;

                if ( errors['required'] && requiredErrorText ) {
                    this.getInvalidForm()?.get( control )?.setValue( requiredErrorText );
                    isValid = false;
                }

                if ( errors['maxlength'] && maxLengthErrorText ) {
                    this.getInvalidForm()?.get( control )?.setValue( maxLengthErrorText );
                    isValid = false;
                }
                if ( errors['minlength'] && minLengthErrorText ) {
                    this.getInvalidForm()?.get( control )?.setValue( minLengthErrorText );
                    isValid = false;
                }
            }
        }

        return isValid;
    }
}
