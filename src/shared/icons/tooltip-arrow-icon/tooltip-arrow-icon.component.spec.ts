import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipArrowIconComponent } from './tooltip-arrow-icon.component';

describe('TooltipArrowIconComponent', () => {
  let component: TooltipArrowIconComponent;
  let fixture: ComponentFixture<TooltipArrowIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipArrowIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TooltipArrowIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
