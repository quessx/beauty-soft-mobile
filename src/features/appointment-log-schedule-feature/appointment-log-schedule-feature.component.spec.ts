import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AppointmentLogScheduleFeatureComponent } from './appointment-log-schedule-feature.component';
import { ScheduleMobileHelper } from '@ui/schedule/helpers/ScheduleMobile.helper';
import { CheckboxPopupService } from '@ui/popups/checkbox-popup';

describe('AppointmentLogScheduleFeatureComponent', () => {
  let fixture: ComponentFixture<AppointmentLogScheduleFeatureComponent>;
  let component: AppointmentLogScheduleFeatureComponent;
  let helperSpy: jasmine.SpyObj<ScheduleMobileHelper>;

  beforeEach(async () => {
    helperSpy = jasmine.createSpyObj('ScheduleMobileHelper', ['setRows', 'setScroll', 'init']);

    await TestBed.configureTestingModule({
      imports: [FullCalendarModule, AppointmentLogScheduleFeatureComponent],
      providers: [
        { provide: ScheduleMobileHelper, useValue: helperSpy },
        { provide: CheckboxPopupService, useValue: jasmine.createSpyObj('CheckboxPopupService', ['show']) }
      ]
    }).compileComponents();

    // Make requestAnimationFrame execute synchronously in tests
    spyOn(window as any, 'requestAnimationFrame').and.callFake((cb: any) => { cb(0); return 0; });

    fixture = TestBed.createComponent(AppointmentLogScheduleFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call helper and turn off loading when events and resources are ready', fakeAsync(() => {
    // initial state: loading
    expect(component.isLoading()).toBeTrue();

    // Simulate both events and resources readiness (internal signals)
    (component as any)._eventsLoaded.set(true);
    (component as any)._resourcesLoaded.set(true);

    // advance time for debounceTime(300) used by the component
    tick(300);

    // requestAnimationFrame is faked to run immediately, so helper methods should have been called
    expect(helperSpy.setRows).toHaveBeenCalled();
    expect(helperSpy.setScroll).toHaveBeenCalled();
    expect(component.isLoading()).toBeFalse();
  }));
});
