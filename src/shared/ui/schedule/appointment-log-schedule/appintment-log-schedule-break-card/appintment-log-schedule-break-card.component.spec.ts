import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppintmentLogScheduleBreakCardComponent } from './appintment-log-schedule-break-card.component';

describe('AppintmentLogScheduleBreakCardComponent', () => {
  let component: AppintmentLogScheduleBreakCardComponent;
  let fixture: ComponentFixture<AppintmentLogScheduleBreakCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppintmentLogScheduleBreakCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppintmentLogScheduleBreakCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
