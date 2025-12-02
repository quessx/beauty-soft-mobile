import { TestBed } from '@angular/core/testing';

import { SearchInputButtonListPopupService } from './search-input-button-list-popup.service';

describe('SearchInputButtonListPopupService', () => {
  let service: SearchInputButtonListPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchInputButtonListPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
