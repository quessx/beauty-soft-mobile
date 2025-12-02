import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextDayProgressComponent } from './next-day-progress.component';

describe('NextDayProgressComponent', () => {
  let component: NextDayProgressComponent;
  let fixture: ComponentFixture<NextDayProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextDayProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextDayProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
