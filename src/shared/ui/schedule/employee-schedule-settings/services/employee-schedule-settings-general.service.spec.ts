import { TestBed } from '@angular/core/testing';

import { EmployeeScheduleSettingsGeneralService } from './employee-schedule-settings-general.service';

describe('EmployeeScheduleSettingsGeneralService', () => {
  let service: EmployeeScheduleSettingsGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeScheduleSettingsGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
