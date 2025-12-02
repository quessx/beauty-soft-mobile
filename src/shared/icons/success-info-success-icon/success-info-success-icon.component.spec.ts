import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessInfoSuccessIconComponent } from './success-info-success-icon.component';

describe('SuccessInfoSuccessIconComponent', () => {
  let component: SuccessInfoSuccessIconComponent;
  let fixture: ComponentFixture<SuccessInfoSuccessIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessInfoSuccessIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessInfoSuccessIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
