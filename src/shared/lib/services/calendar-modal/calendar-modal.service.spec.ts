import { TestBed } from '@angular/core/testing';

import { CalendarModalService } from './calendar-modal.service';

describe('CalendarModalService', () => {
  let service: CalendarModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
