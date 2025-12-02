import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('CheckboxComponent', () => {
    let component: CheckboxComponent;
    let fixture: ComponentFixture<CheckboxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CheckboxComponent, FormsModule, ReactiveFormsModule],
        }).compileComponents();
        fixture = TestBed.createComponent(CheckboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit checkedChange and call onChange on input', () => {
        spyOn(component.checkedChange, 'emit');
        spyOn(component, 'onChange');
        const input = fixture.debugElement.query(By.css('input'));
        input.nativeElement.checked = true;
        input.triggerEventHandler('change', { target: input.nativeElement });
        expect(component.checkedChange.emit).toHaveBeenCalledWith(true);
        expect(component.onChange).toHaveBeenCalledWith(true);
    });
});
