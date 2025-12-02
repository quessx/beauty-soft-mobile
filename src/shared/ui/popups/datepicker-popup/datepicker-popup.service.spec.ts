import { TestBed } from '@angular/core/testing';

import { DatepickerPopupService } from './datepicker-popup.service';

describe('DatepickerPopupService', () => {
  let service: DatepickerPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatepickerPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
