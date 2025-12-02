import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCardIconComponent } from './bank-card-icon.component';

describe('BankCardIconComponent', () => {
  let component: BankCardIconComponent;
  let fixture: ComponentFixture<BankCardIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankCardIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankCardIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
