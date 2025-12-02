import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationPopupComponent } from './information-popup.component';

describe('SuccessInformationPopupComponent', () => {
  let component: InformationPopupComponent;
  let fixture: ComponentFixture<InformationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
