import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarScrollableComponent } from './calendar-scrollable.component';

describe('CalendarComponent', () => {
  let component: CalendarScrollableComponent;
  let fixture: ComponentFixture<CalendarScrollableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarScrollableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarScrollableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
