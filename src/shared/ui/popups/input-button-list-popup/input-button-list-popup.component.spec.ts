import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputButtonListPopupComponent } from './input-button-list-popup.component';

describe('InputButtonListPopupComponent', () => {
  let component: InputButtonListPopupComponent;
  let fixture: ComponentFixture<InputButtonListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputButtonListPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputButtonListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
