import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentIconComponent } from './percent-icon.component';

describe('PercentIconComponent', () => {
  let component: PercentIconComponent;
  let fixture: ComponentFixture<PercentIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PercentIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PercentIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
