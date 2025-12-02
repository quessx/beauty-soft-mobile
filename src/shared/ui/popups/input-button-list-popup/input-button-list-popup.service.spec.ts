import { TestBed } from '@angular/core/testing';

import { InputButtonListPopupService } from './input-button-list-popup.service';

describe('InputButtonListPopupService', () => {
  let service: InputButtonListPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputButtonListPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
