import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenArmIconComponent } from './open-arm-icon.component';

describe('OpenArmIconComponent', () => {
  let component: OpenArmIconComponent;
  let fixture: ComponentFixture<OpenArmIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenArmIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenArmIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
