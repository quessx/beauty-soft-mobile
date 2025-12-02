import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateBodyOfModalComponent } from './template-body-of-modal.component';

describe('TemplateBodyOfModalComponent', () => {
  let component: TemplateBodyOfModalComponent;
  let fixture: ComponentFixture<TemplateBodyOfModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateBodyOfModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateBodyOfModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
