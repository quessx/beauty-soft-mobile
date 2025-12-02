import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsWrapperComponent } from './actions-wrapper.component';

describe('ActionsWrapperComponent', () => {
  let component: ActionsWrapperComponent;
  let fixture: ComponentFixture<ActionsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
