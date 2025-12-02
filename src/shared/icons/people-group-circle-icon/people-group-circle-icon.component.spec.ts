import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PeopleGroupCircleIconComponent } from './people-group-circle-icon.component';


describe('PeopleGroupCircleIconComponent', () => {
  let component: PeopleGroupCircleIconComponent;
  let fixture: ComponentFixture<PeopleGroupCircleIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleGroupCircleIconComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleGroupCircleIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
