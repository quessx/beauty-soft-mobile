import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightColumnLineComponent } from './right-column-line.component';

describe('RightColumnLineComponent', () => {
  let component: RightColumnLineComponent;
  let fixture: ComponentFixture<RightColumnLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightColumnLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightColumnLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
