import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftColumnForLineComponent } from './left-column-for-line.component';

describe('LeftColumnForLineComponent', () => {
  let component: LeftColumnForLineComponent;
  let fixture: ComponentFixture<LeftColumnForLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftColumnForLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftColumnForLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
