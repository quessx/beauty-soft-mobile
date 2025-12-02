import { TestBed } from '@angular/core/testing';

import { ElementActionsWrapperService } from './element-actions-wrapper.service';

describe('ElementActionsWrapperService', () => {
  let service: ElementActionsWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementActionsWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
