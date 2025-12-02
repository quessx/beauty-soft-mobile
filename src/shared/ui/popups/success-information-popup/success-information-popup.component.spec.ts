import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessInformationPopupComponent } from './success-information-popup.component';

describe('SuccessInformationPopupComponent', () => {
  let component: SuccessInformationPopupComponent;
  let fixture: ComponentFixture<SuccessInformationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessInformationPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessInformationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
