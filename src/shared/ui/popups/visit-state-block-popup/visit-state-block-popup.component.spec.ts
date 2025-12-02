import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitStateBlockPopupComponent } from './visit-state-block-popup.component';

describe('VisitStateBlockPopupComponent', () => {
  let component: VisitStateBlockPopupComponent;
  let fixture: ComponentFixture<VisitStateBlockPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitStateBlockPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitStateBlockPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
