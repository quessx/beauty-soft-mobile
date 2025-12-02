import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragIndicatorIconComponent } from './drag-indicator-icon.component';

describe('DragIndicatorIconComponent', () => {
  let component: DragIndicatorIconComponent;
  let fixture: ComponentFixture<DragIndicatorIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragIndicatorIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DragIndicatorIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
