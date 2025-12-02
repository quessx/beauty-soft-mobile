import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddOrederPopupWidgetComponent } from './add-oreder-popup-widget.component';

describe('AddOrederPopupWidgetComponent', () => {
  let component: AddOrederPopupWidgetComponent;
  let fixture: ComponentFixture<AddOrederPopupWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrederPopupWidgetComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddOrederPopupWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
