import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TimeRangeInputComponent } from './time-range-input.component';
import type { TimeRangeValue } from './time-range-input.types';
import { TuiTime } from '@taiga-ui/cdk';

describe('TimeRangeInputComponent (formGroup mode)', () => {
  let component: TimeRangeInputComponent;
  let fixture: ComponentFixture<TimeRangeInputComponent>;
  let form: FormGroup;

  beforeEach(async () => {
    form = new FormGroup({
      fromTime: new FormControl(new TuiTime(9, 0)),
      toTime: new FormControl(new TuiTime(10, 0))
    });

    await TestBed.configureTestingModule({
      imports: [TimeRangeInputComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TimeRangeInputComponent);
    component = fixture.componentInstance;
    component.formGroup = form;
    fixture.detectChanges();
  });

  it('should render initial values', () => {
    expect(component.startTimeValue).toBe('09:00');
    expect(component.endTimeValue).toBe('10:00');
  });

  it('should enforce order when start is set after end', () => {
    form.get('fromTime')!.setValue(new TuiTime(12, 0));
    form.get('toTime')!.setValue(new TuiTime(11, 0));
    component['ensureOrder']();
    const end = form.get('toTime')!.value as TuiTime;
    expect(end.hours * 60 + end.minutes).toBeGreaterThanOrEqual(12 * 60);
  });
});

describe('TimeRangeInputComponent (CVA mode)', () => {
  let component: TimeRangeInputComponent;
  let fixture: ComponentFixture<TimeRangeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeRangeInputComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(TimeRangeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should writeValue and expose values', () => {
    component.writeValue({ startTime: '08:15', endTime: '09:45' });
    expect(component.startTimeValue).toBe('08:15');
    expect(component.endTimeValue).toBe('09:45');
  });

  it('should propagate onChange in CVA mode', () => {
    const spy = jasmine.createSpy<(value: TimeRangeValue | null) => void>('onChange');
    component.registerOnChange(spy);
    component.onStartTimeChange({ target: { value: '07:30' } } as any as Event);
    expect(spy).toHaveBeenCalled();
  });
});
