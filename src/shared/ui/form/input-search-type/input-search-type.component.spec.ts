import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSearchTypeComponent } from './input-search-type.component';

describe('InputSearchTypeComponent', () => {
  let component: InputSearchTypeComponent;
  let fixture: ComponentFixture<InputSearchTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSearchTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputSearchTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
