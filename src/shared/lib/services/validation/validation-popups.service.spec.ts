import { TestBed } from '@angular/core/testing';
import { ValidationPopupsService } from './validation-popups.service';


describe('ValidationPopupsService', () => {
  let service: ValidationPopupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationPopupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
