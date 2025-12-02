import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxCardGroupComponent } from './checkbox-card-group.component';

describe('CheckboxCardGroupComponent', () => {
  let component: CheckboxCardGroupComponent;
  let fixture: ComponentFixture<CheckboxCardGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxCardGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxCardGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
