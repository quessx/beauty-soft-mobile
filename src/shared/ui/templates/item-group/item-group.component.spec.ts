import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemGroupComponent } from './item-group.component';

describe( 'ItemGroupComponent', () => {
    let component: ItemGroupComponent;
    let fixture: ComponentFixture<ItemGroupComponent>;

    beforeEach( async () => {
        await TestBed.configureTestingModule( {
            imports: [ItemGroupComponent]
        } ).compileComponents();

        fixture = TestBed.createComponent( ItemGroupComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );

    it( 'should initialize form with empty values', () => {
        expect( component.form.controls.firstName.value ).toBe( '' );
        expect( component.form.controls.lastName.value ).toBe( '' );
    } );

    it( 'should clear first name when onClearFirstName is called', () => {
        component.form.controls.firstName.setValue( 'Test' );
        expect( component.form.controls.firstName.value ).toBe( 'Test' );
        
        component.onClearFirstName();
        
        expect( component.form.controls.firstName.value ).toBe( '' );
    } );

    it( 'should emit clearFirstName event when onClearFirstName is called', () => {
        spyOn( component.clearFirstName, 'emit' );
        
        component.onClearFirstName();
        
        expect( component.clearFirstName.emit ).toHaveBeenCalled();
    } );
} );
