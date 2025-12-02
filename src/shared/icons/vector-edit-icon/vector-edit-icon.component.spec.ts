import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VectorEditIconComponent } from './vector-edit-icon.component';

describe('VectorIconComponent', () => {
  let component: VectorEditIconComponent;
  let fixture: ComponentFixture<VectorEditIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VectorEditIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VectorEditIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
