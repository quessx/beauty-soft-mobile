import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusOnlineIconComponent } from './status-online-icon.component';

describe('StatusOnlineIconComponent', () => {
  let component: StatusOnlineIconComponent;
  let fixture: ComponentFixture<StatusOnlineIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusOnlineIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusOnlineIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
