import { TestBed } from '@angular/core/testing';

import { DefaultOverlayService } from './default-overlay.service';

describe('DefaultOverlayService', () => {
  let service: DefaultOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
