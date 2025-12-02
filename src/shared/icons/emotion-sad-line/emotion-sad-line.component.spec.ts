import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmotionSadLineComponent } from './emotion-sad-line.component';

describe('EmotionSadLineComponent', () => {
  let component: EmotionSadLineComponent;
  let fixture: ComponentFixture<EmotionSadLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmotionSadLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmotionSadLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
