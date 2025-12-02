import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerInBodyAuthorizationComponent } from './container-in-body-authorization.component';

describe('ContainerInBodyAuthorizationComponent', () => {
  let component: ContainerInBodyAuthorizationComponent;
  let fixture: ComponentFixture<ContainerInBodyAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerInBodyAuthorizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerInBodyAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
