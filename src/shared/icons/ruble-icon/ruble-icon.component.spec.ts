import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubleIconComponent } from './ruble-icon.component';

describe('RubleIconComponent', () => {
  let component: RubleIconComponent;
  let fixture: ComponentFixture<RubleIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RubleIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RubleIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
