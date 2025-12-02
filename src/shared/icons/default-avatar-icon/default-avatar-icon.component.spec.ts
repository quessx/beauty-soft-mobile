import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultAvatarIconComponent } from './default-avatar-icon.component';

describe('DefaultAvatarIconComponent', () => {
  let component: DefaultAvatarIconComponent;
  let fixture: ComponentFixture<DefaultAvatarIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultAvatarIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultAvatarIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
