import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VectorIconComponent } from './vector-icon.component';

describe('VectorIconComponent', () => {
  let component: VectorIconComponent;
  let fixture: ComponentFixture<VectorIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VectorIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VectorIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
