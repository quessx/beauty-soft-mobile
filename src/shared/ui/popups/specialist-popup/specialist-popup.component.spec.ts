import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistPopupComponent } from './specialist-popup.component';

describe('SpecialistPopupComponent', () => {
  let component: SpecialistPopupComponent;
  let fixture: ComponentFixture<SpecialistPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialistPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialistPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
