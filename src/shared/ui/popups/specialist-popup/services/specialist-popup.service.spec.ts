import { TestBed } from '@angular/core/testing';

import { SpecialistPopupService } from './specialist-popup.service';

describe('SpecialistPopupService', () => {
  let service: SpecialistPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialistPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
