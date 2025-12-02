import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialistComponent } from './specialist.component';
import { PositionsTableItem } from '@entities/speciality';

describe( 'SpecialistComponent', () => {
  let component: SpecialistComponent;
  let fixture: ComponentFixture<SpecialistComponent>;
  let changeSpyCalls: string[];

  const buildOption = ( id: string, name: string ): PositionsTableItem => {
    return new PositionsTableItem( { id: id, orderName: name } );
  };

  beforeEach( async () => {
    changeSpyCalls = [];
    await TestBed.configureTestingModule( {
      imports: [SpecialistComponent]
    } ).compileComponents();

    fixture = TestBed.createComponent( SpecialistComponent );
    component = fixture.componentInstance;
    // Provide required input options
    ( component as any ).options = (): PositionsTableItem[] => [
      buildOption( '1', 'One' ),
      buildOption( '2', 'Two' )
    ];
    component.registerOnChange( ( v: string ): void => {
      changeSpyCalls.push( v );
    } );
    component.registerOnTouched( (): void => { return; } );
    fixture.detectChanges();
  });

  it( 'should create', () => {
    expect( component ).toBeTruthy();
  });

  it( 'should writeValue without emitting duplicate change', () => {
    component.writeValue( '1' );
    // No change event expected yet because writeValue sets internalWrite
    expect( changeSpyCalls.length ).toBe( 0 );
    // Simulate user selecting same value -> no duplicate emission
    ( component as any ).selectOption.set( '1' );
    expect( changeSpyCalls.length ).toBe( 1 ); // first user emission
    ( component as any ).selectOption.set( '1' );
    expect( changeSpyCalls.length ).toBe( 1 ); // still one, no duplicate
  });

  it( 'should emit change only on real user changes', () => {
    component.writeValue( '1' );
    ( component as any ).selectOption.set( '2' );
    expect( changeSpyCalls ).toEqual( ['2'] );
  });

  it( 'should ignore writeValue if value unchanged', () => {
    component.writeValue( '1' );
    expect( ( component as any ).selectOption() ).toBe( '1' );
    component.writeValue( '1' );
    // No new emissions
    expect( changeSpyCalls.length ).toBe( 0 );
  });

  it( 'should support disabled state', () => {
    component.setDisabledState( true );
    const popupService: any = ( component as any ).specialistPopupService;
    spyOn( popupService, 'show' );
    component.onClick();
    expect( popupService.show ).not.toHaveBeenCalled();
  });
});
