import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDetailsWidgetComponent } from './appointment-details-widget.component';

describe('AppointmentDetailsWidgetComponent', () => {
  let component: AppointmentDetailsWidgetComponent;
  let fixture: ComponentFixture<AppointmentDetailsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentDetailsWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentDetailsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formats russian phone from +79991110705 to +7 999 111-07-05', () => {
    const formatted = (component as any).formatPhone('+79991110705');
    expect(formatted).toBe('+7 999 111-07-05');
  });

  it('formats russian phone without country code 89991110705 to +7 999 111-07-05', () => {
    const formatted = (component as any).formatPhone('89991110705');
    expect(formatted).toBe('+7 999 111-07-05');
  });
});
