import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitStateBlockComponent } from './visit-state-block.component';

describe('VisitStateBlockComponent', () => {
  let component: VisitStateBlockComponent;
  let fixture: ComponentFixture<VisitStateBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitStateBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitStateBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
