import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateWhiteBackgroundComponent } from './template-white-background.component';

describe('TemplateWhiteBackgroundComponent', () => {
  let component: TemplateWhiteBackgroundComponent;
  let fixture: ComponentFixture<TemplateWhiteBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateWhiteBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateWhiteBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
