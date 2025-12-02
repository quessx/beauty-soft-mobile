import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxPopupComponent } from './checkbox-popup.component';

describe('CheckboxPopupComponent', () => {
  let component: CheckboxPopupComponent;
  let fixture: ComponentFixture<CheckboxPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
