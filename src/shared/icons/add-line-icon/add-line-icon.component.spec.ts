import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLineIconComponent } from './add-line-icon.component';

describe('BankCardIconComponent', () => {
  let component: AddLineIconComponent;
  let fixture: ComponentFixture<AddLineIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLineIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLineIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
