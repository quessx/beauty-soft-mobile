import { TestBed } from '@angular/core/testing';

import { AddOrderPopupFeatureService } from './add-order-popup-feature.service';

describe('AddOrderPopupFeatureService', () => {
  let service: AddOrderPopupFeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddOrderPopupFeatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
