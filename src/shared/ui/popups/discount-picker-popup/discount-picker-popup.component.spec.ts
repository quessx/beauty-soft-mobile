import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountPickerPopupComponent } from './discount-picker-popup.component';

describe('DiscountPickerPopupComponent', () => {
  let component: DiscountPickerPopupComponent;
  let fixture: ComponentFixture<DiscountPickerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountPickerPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountPickerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
