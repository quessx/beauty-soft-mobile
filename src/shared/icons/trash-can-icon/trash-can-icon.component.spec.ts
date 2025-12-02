import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashCanIconComponent } from './trash-can-icon.component';

describe('TrashCanIconComponent', () => {
  let component: TrashCanIconComponent;
  let fixture: ComponentFixture<TrashCanIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrashCanIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrashCanIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
