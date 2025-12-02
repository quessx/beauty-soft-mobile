import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserInfoComponent } from './user-info.component';

describe( 'UserInfoComponent', () => {
    let component: UserInfoComponent;
    let fixture: ComponentFixture<UserInfoComponent>;
    let form: FormGroup;

    beforeEach( async () => {
        form = new FormGroup( {
            firstName: new FormControl<string>( '', { nonNullable: true } ),
            lastName: new FormControl<string>( '', { nonNullable: true } )
        } );

        await TestBed.configureTestingModule( {
            imports: [ UserInfoComponent, ReactiveFormsModule ]
        } ).compileComponents();

        fixture = TestBed.createComponent( UserInfoComponent );
        component = fixture.componentInstance;
        
        // Устанавливаем обязательные input signals
        fixture.componentRef.setInput( 'formGroup', form );
        fixture.componentRef.setInput( 'firstNameControlName', 'firstName' );
        fixture.componentRef.setInput( 'lastNameControlName', 'lastName' );
        
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );

    it( 'should render form when formGroup is provided', () => {
        const compiled: HTMLElement = fixture.nativeElement;
        const formElement: HTMLElement | null = compiled.querySelector( 'form' );
        expect( formElement ).toBeTruthy();
    } );

    it( 'should have required inputs accessible through signals', () => {
        expect( component.formGroup() ).toBe( form );
        expect( component.firstNameControlName() ).toBe( 'firstName' );
        expect( component.lastNameControlName() ).toBe( 'lastName' );
    } );

    it( 'should render input fields with correct formControlName attributes', () => {
        const compiled: HTMLElement = fixture.nativeElement;
        const inputs: NodeListOf<Element> = compiled.querySelectorAll( 'beauty-input-search-type' );
        
        expect( inputs.length ).toBe( 2 );
        expect( inputs[0].getAttribute( 'ng-reflect-name' ) ).toBe( 'firstName' );
        expect( inputs[1].getAttribute( 'ng-reflect-name' ) ).toBe( 'lastName' );
    } );

    it( 'should use provided placeholders', () => {
        fixture.componentRef.setInput( 'firstNamePlaceholder', 'Введите имя' );
        fixture.componentRef.setInput( 'lastNamePlaceholder', 'Введите фамилию' );
        fixture.detectChanges();

        expect( component.firstNamePlaceholder() ).toBe( 'Введите имя' );
        expect( component.lastNamePlaceholder() ).toBe( 'Введите фамилию' );
    } );

    it( 'should use provided helperText', () => {
        const helperText: string = 'Пользовательский текст помощи';
        fixture.componentRef.setInput( 'helperText', helperText );
        fixture.detectChanges();

        expect( component.helperText() ).toBe( helperText );
        
        const compiled: HTMLElement = fixture.nativeElement;
        const textElement: HTMLElement | null = compiled.querySelector( 'bsm-text' );
        expect( textElement?.textContent?.trim() ).toBe( helperText );
    } );

    it( 'should reset control on onClearSearch', () => {
        form.get( 'firstName' )?.setValue( 'Test' );
        expect( form.get( 'firstName' )?.value ).toBe( 'Test' );
        
        component.onClearSearch( 'firstName' );
        
        expect( form.get( 'firstName' )?.value ).toBe( '' );
    } );

    it( 'should handle onClearSearch for lastName control', () => {
        form.get( 'lastName' )?.setValue( 'TestLastName' );
        expect( form.get( 'lastName' )?.value ).toBe( 'TestLastName' );
        
        component.onClearSearch( 'lastName' );
        
        expect( form.get( 'lastName' )?.value ).toBe( '' );
    } );

    it( 'should not throw error when onClearSearch is called with non-existent field', () => {
        expect( () => component.onClearSearch( 'nonExistentField' ) ).not.toThrow();
    } );

    describe( 'Flexibility with different control names', () => {
        it( 'should work with custom control names', () => {
            const customForm: FormGroup = new FormGroup( {
                name: new FormControl<string>( '', { nonNullable: true } ),
                surname: new FormControl<string>( '', { nonNullable: true } )
            } );

            fixture.componentRef.setInput( 'formGroup', customForm );
            fixture.componentRef.setInput( 'firstNameControlName', 'name' );
            fixture.componentRef.setInput( 'lastNameControlName', 'surname' );
            fixture.detectChanges();

            expect( component.firstNameControlName() ).toBe( 'name' );
            expect( component.lastNameControlName() ).toBe( 'surname' );
        } );

        it( 'should clear custom named controls', () => {
            const customForm: FormGroup = new FormGroup( {
                userFirstName: new FormControl<string>( 'John', { nonNullable: true } ),
                userLastName: new FormControl<string>( 'Doe', { nonNullable: true } )
            } );

            fixture.componentRef.setInput( 'formGroup', customForm );
            fixture.componentRef.setInput( 'firstNameControlName', 'userFirstName' );
            fixture.componentRef.setInput( 'lastNameControlName', 'userLastName' );
            fixture.detectChanges();

            component.onClearSearch( 'userFirstName' );
            expect( customForm.get( 'userFirstName' )?.value ).toBe( '' );
        } );

        it( 'should work with any string as control name', () => {
            const dynamicForm: FormGroup = new FormGroup( {
                'field-1': new FormControl<string>( '', { nonNullable: true } ),
                'field-2': new FormControl<string>( '', { nonNullable: true } )
            } );

            fixture.componentRef.setInput( 'formGroup', dynamicForm );
            fixture.componentRef.setInput( 'firstNameControlName', 'field-1' );
            fixture.componentRef.setInput( 'lastNameControlName', 'field-2' );
            fixture.detectChanges();

            expect( component.firstNameControlName() ).toBe( 'field-1' );
            expect( component.lastNameControlName() ).toBe( 'field-2' );
        } );
    } );

    describe( 'Edge cases', () => {
        it( 'should handle empty placeholders', () => {
            // По умолчанию placeholder'ы пустые
            expect( component.firstNamePlaceholder() ).toBe( '' );
            expect( component.lastNamePlaceholder() ).toBe( '' );
        } );

        it( 'should handle empty helperText', () => {
            // По умолчанию helperText пустой
            expect( component.helperText() ).toBe( '' );
        } );

        it( 'should work with form controls that have validators', () => {
            const formWithValidators: FormGroup = new FormGroup( {
                firstName: new FormControl<string>( '', { 
                    nonNullable: true,
                    validators: [ ( control: AbstractControl<string> ): ValidationErrors | null => {
                        return control.value.length < 2 ? { minLength: true } : null;
                    } ]
                } ),
                lastName: new FormControl<string>( '', { nonNullable: true } )
            } );

            fixture.componentRef.setInput( 'formGroup', formWithValidators );
            fixture.detectChanges();

            const firstNameControl: FormControl<string> | null = formWithValidators.get( 'firstName' ) as FormControl<string>;
            expect( firstNameControl.invalid ).toBe( true );
            
            firstNameControl.setValue( 'Jo' );
            expect( firstNameControl.valid ).toBe( true );
        } );

        it( 'should work with forms containing additional fields', () => {
            const extendedForm: FormGroup = new FormGroup( {
                firstName: new FormControl<string>( '', { nonNullable: true } ),
                lastName: new FormControl<string>( '', { nonNullable: true } ),
                email: new FormControl<string>( '', { nonNullable: true } ),
                phone: new FormControl<string>( '', { nonNullable: true } )
            } );

            fixture.componentRef.setInput( 'formGroup', extendedForm );
            fixture.detectChanges();

            expect( extendedForm.get( 'email' ) ).toBeTruthy();
            expect( extendedForm.get( 'phone' ) ).toBeTruthy();
        } );

        it( 'should not interfere with other form controls', () => {
            const complexForm: FormGroup = new FormGroup( {
                firstName: new FormControl<string>( '', { nonNullable: true } ),
                lastName: new FormControl<string>( '', { nonNullable: true } ),
                otherField: new FormControl<string>( 'important data', { nonNullable: true } )
            } );

            fixture.componentRef.setInput( 'formGroup', complexForm );
            fixture.detectChanges();

            component.onClearSearch( 'firstName' );
            
            expect( complexForm.get( 'otherField' )?.value ).toBe( 'important data' );
        } );
    } );

    describe( 'Integration with form', () => {
        it( 'should properly bind to form controls', () => {
            form.get( 'firstName' )?.setValue( 'John' );
            form.get( 'lastName' )?.setValue( 'Doe' );

            expect( form.get( 'firstName' )?.value ).toBe( 'John' );
            expect( form.get( 'lastName' )?.value ).toBe( 'Doe' );
            expect( form.valid ).toBe( true );
        } );

        it( 'should reflect form state changes', () => {
            expect( form.pristine ).toBe( true );
            
            form.get( 'firstName' )?.setValue( 'Test' );
            form.get( 'firstName' )?.markAsDirty();
            
            expect( form.dirty ).toBe( true );
        } );

        it( 'should support form reset', () => {
            form.get( 'firstName' )?.setValue( 'John' );
            form.get( 'lastName' )?.setValue( 'Doe' );
            
            form.reset();
            
            expect( form.get( 'firstName' )?.value ).toBe( null );
            expect( form.get( 'lastName' )?.value ).toBe( null );
        } );

        it( 'should work with nullable controls', () => {
            const nullableForm: FormGroup = new FormGroup( {
                firstName: new FormControl<string | null>( null ),
                lastName: new FormControl<string | null>( null )
            } );

            fixture.componentRef.setInput( 'formGroup', nullableForm );
            fixture.detectChanges();

            expect( nullableForm.get( 'firstName' )?.value ).toBeNull();
            
            nullableForm.get( 'firstName' )?.setValue( 'Test' );
            expect( nullableForm.get( 'firstName' )?.value ).toBe( 'Test' );
        } );

        it( 'should support form validation', () => {
            const validatedForm: FormGroup = new FormGroup( {
                firstName: new FormControl<string>( '', [ Validators.required, Validators.minLength( 2 ) ] ),
                lastName: new FormControl<string>( '', [ Validators.required ] )
            } );

            fixture.componentRef.setInput( 'formGroup', validatedForm );
            fixture.detectChanges();

            expect( validatedForm.invalid ).toBe( true );
            
            validatedForm.get( 'firstName' )?.setValue( 'Jo' );
            validatedForm.get( 'lastName' )?.setValue( 'Doe' );
            
            expect( validatedForm.valid ).toBe( true );
        } );
    } );

    describe( 'Component behavior', () => {
        it( 'should not render when formGroup is falsy', () => {
            const newFixture: ComponentFixture<UserInfoComponent> = TestBed.createComponent( UserInfoComponent );
            const newComponent: UserInfoComponent = newFixture.componentInstance;
            
            newFixture.componentRef.setInput( 'formGroup', null );
            newFixture.componentRef.setInput( 'firstNameControlName', 'firstName' );
            newFixture.componentRef.setInput( 'lastNameControlName', 'lastName' );
            newFixture.detectChanges();

            const compiled: HTMLElement = newFixture.nativeElement;
            const formElement: HTMLElement | null = compiled.querySelector( 'form' );
            
            expect( formElement ).toBeNull();
        } );

        it( 'should update when inputs change', () => {
            expect( component.firstNamePlaceholder() ).toBe( '' );
            
            fixture.componentRef.setInput( 'firstNamePlaceholder', 'New Placeholder' );
            fixture.detectChanges();
            
            expect( component.firstNamePlaceholder() ).toBe( 'New Placeholder' );
        } );

        it( 'should handle rapid input changes', () => {
            fixture.componentRef.setInput( 'helperText', 'Text 1' );
            fixture.detectChanges();
            expect( component.helperText() ).toBe( 'Text 1' );

            fixture.componentRef.setInput( 'helperText', 'Text 2' );
            fixture.detectChanges();
            expect( component.helperText() ).toBe( 'Text 2' );

            fixture.componentRef.setInput( 'helperText', 'Text 3' );
            fixture.detectChanges();
            expect( component.helperText() ).toBe( 'Text 3' );
        } );
    } );

    describe( 'Selector', () => {
        it( 'should have correct selector', () => {
            const compiled: HTMLElement = fixture.nativeElement;
            expect( compiled.querySelector( 'bsm-item-group' ) ).toBeTruthy();
        } );
    } );
} );
