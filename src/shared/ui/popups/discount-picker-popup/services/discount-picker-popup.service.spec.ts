import { TestBed } from '@angular/core/testing';

import { DiscountPickerPopupService } from './discount-picker-popup.service';

describe('DiscountPickerPopupService', () => {
  let service: DiscountPickerPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountPickerPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
