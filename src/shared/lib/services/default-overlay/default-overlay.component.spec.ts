import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultOverlayComponent } from './default-overlay.component';

describe('DefaultOverlayComponent', () => {
  let component: DefaultOverlayComponent;
  let fixture: ComponentFixture<DefaultOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
  imports: [ DefaultOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
