import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateLeftColumnCardComponent } from './template-left-column-card.component';

describe('TemplateLeftColumnCardComponent', () => {
  let component: TemplateLeftColumnCardComponent;
  let fixture: ComponentFixture<TemplateLeftColumnCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateLeftColumnCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateLeftColumnCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
