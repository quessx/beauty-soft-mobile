import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendateCardComponent } from './calendate-card.component';

describe('CalendateCardComponent', () => {
  let component: CalendateCardComponent;
  let fixture: ComponentFixture<CalendateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendateCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
