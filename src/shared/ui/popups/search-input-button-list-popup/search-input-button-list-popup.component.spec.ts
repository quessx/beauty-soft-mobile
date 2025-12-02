import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInputButtonListPopupComponent } from './search-input-button-list-popup.component';

describe('SearchInputButtonListPopupComponent', () => {
  let component: SearchInputButtonListPopupComponent;
  let fixture: ComponentFixture<SearchInputButtonListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInputButtonListPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchInputButtonListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
