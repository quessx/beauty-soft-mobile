import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxedIconComponent } from './checkboxed-icon.component';

describe('BankCardIconComponent', () => {
  let component: CheckboxedIconComponent;
  let fixture: ComponentFixture<CheckboxedIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxedIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
