import { TestBed } from '@angular/core/testing';

import { SuccessInformationPopupService } from './success-information-popup.service';

describe('SuccessInformationPopupService', () => {
  let service: SuccessInformationPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuccessInformationPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
