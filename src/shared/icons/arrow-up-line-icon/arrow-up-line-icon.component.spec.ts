import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowUpLineIconComponent } from './arrow-up-line-icon.component';

describe('BankCardIconComponent', () => {
  let component: ArrowUpLineIconComponent;
  let fixture: ComponentFixture<ArrowUpLineIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowUpLineIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowUpLineIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
