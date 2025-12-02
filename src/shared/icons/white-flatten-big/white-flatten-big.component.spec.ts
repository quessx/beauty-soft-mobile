import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteFlattenBigComponent } from './white-flatten-big.component';

describe('WhiteFlattenBigComponent', () => {
  let component: WhiteFlattenBigComponent;
  let fixture: ComponentFixture<WhiteFlattenBigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhiteFlattenBigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhiteFlattenBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
