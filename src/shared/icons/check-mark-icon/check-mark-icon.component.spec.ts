import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckMarkIconComponent } from './check-mark-icon.component';

describe('CheckMarkIconComponent', () => {
  let component: CheckMarkIconComponent;
  let fixture: ComponentFixture<CheckMarkIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckMarkIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckMarkIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
