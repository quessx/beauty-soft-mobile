import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonListPopupComponent } from './button-list-popup.component';

describe('ButtonListPopupComponent', () => {
  let component: ButtonListPopupComponent;
  let fixture: ComponentFixture<ButtonListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonListPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
