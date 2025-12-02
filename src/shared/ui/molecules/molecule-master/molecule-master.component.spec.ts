import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculeMasterComponent } from './molecule-master.component';

describe('MoleculeMasterComponent', () => {
  let component: MoleculeMasterComponent;
  let fixture: ComponentFixture<MoleculeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoleculeMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoleculeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
