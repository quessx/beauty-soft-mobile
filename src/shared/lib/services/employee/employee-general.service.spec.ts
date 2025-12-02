import { TestBed } from '@angular/core/testing';

import { EmployeeGeneralService } from './employee-general.service';

describe('EmployeeGeneralService', () => {
  let service: EmployeeGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
