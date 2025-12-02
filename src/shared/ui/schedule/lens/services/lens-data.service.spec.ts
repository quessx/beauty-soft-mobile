import { TestBed } from '@angular/core/testing';

import { LensDataService } from './lens-data.service';

describe('LensDataService', () => {
  let service: LensDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LensDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
