import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpendableIconComponent } from './expendable-icon.component';

describe('ExpendableIconComponent', () => {
  let component: ExpendableIconComponent;
  let fixture: ComponentFixture<ExpendableIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpendableIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpendableIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
