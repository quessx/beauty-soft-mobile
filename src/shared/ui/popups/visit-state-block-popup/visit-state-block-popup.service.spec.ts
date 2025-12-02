import { TestBed } from '@angular/core/testing';

import { VisitStateBlockPopupService } from './visit-state-block-popup.service';

describe('VisitStateBlockPopupService', () => {
  let service: VisitStateBlockPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitStateBlockPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
