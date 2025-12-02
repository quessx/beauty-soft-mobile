import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundedCheckIconComponent } from './rounded-check-icon.component';

describe('BankCardIconComponent', () => {
  let component: RoundedCheckIconComponent;
  let fixture: ComponentFixture<RoundedCheckIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundedCheckIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundedCheckIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
