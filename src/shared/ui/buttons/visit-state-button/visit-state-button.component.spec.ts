import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitStateButtonComponent } from './visit-state-button.component';

describe('VisitStateButtonComponent', () => {
  let component: VisitStateButtonComponent;
  let fixture: ComponentFixture<VisitStateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitStateButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitStateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
