import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioPopupComponent } from './radio-popup.component';

describe('CheckboxPopupComponent', () => {
  let component: RadioPopupComponent;
  let fixture: ComponentFixture<RadioPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
