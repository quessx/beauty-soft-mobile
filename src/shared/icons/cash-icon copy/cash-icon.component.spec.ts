import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashIconComponent } from './cash-icon.component';

describe('BankCardIconComponent', () => {
  let component: CashIconComponent;
  let fixture: ComponentFixture<CashIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
