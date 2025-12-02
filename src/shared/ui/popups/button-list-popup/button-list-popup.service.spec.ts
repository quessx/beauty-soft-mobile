import { TestBed } from '@angular/core/testing';

import { ButtonListPopupService } from './button-list-popup.service';

describe('ButtonListPopupService', () => {
  let service: ButtonListPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonListPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
