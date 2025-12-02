import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendateIconComponent } from './calendate-icon.component';

describe('CalendateIconComponent', () => {
  let component: CalendateIconComponent;
  let fixture: ComponentFixture<CalendateIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendateIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendateIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
