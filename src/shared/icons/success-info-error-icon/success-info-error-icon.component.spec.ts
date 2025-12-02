import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessInfoErrorIconComponent } from './success-info-error-icon.component';

describe('SuccessInfoErrorIconComponent', () => {
  let component: SuccessInfoErrorIconComponent;
  let fixture: ComponentFixture<SuccessInfoErrorIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessInfoErrorIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessInfoErrorIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
