import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateLineComponent } from './template-line.component';

describe('TemplateLineComponent', () => {
  let component: TemplateLineComponent;
  let fixture: ComponentFixture<TemplateLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
