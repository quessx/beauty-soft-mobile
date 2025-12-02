import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoupeIconComponent } from './loupe-icon.component';

describe('LoupeIconComponent', () => {
  let component: LoupeIconComponent;
  let fixture: ComponentFixture<LoupeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoupeIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoupeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
