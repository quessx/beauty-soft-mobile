import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowIconComponent } from './arrow-icon.component';

describe('BankCardIconComponent', () => {
  let component: ArrowIconComponent;
  let fixture: ComponentFixture<ArrowIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
