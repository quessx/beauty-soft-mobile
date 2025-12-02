import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffeeBreakIconComponent } from './coffee-break-icon.component';

describe('BankCardIconComponent', () => {
  let component: CoffeeBreakIconComponent;
  let fixture: ComponentFixture<CoffeeBreakIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoffeeBreakIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoffeeBreakIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
