import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalListboxItemComponent } from './horizontal-listbox-item.component';

describe('HorizontalListboxItemComponent', () => {
  let component: HorizontalListboxItemComponent;
  let fixture: ComponentFixture<HorizontalListboxItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalListboxItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalListboxItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
