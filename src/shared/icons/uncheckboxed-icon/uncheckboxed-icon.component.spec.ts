import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UncheckboxedIconComponent } from './uncheckboxed-icon.component';

describe('BankCardIconComponent', () => {
  let component: UncheckboxedIconComponent;
  let fixture: ComponentFixture<UncheckboxedIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncheckboxedIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UncheckboxedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
