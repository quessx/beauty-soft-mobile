import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentLogWidgetComponent } from './appointment-log-widget.component';

describe('AppointmentLogWidgetComponent', () => {
  let component: AppointmentLogWidgetComponent;
  let fixture: ComponentFixture<AppointmentLogWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentLogWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentLogWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
