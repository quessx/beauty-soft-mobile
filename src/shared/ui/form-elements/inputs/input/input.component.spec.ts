import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('InputComponent', () => {
    let component: InputComponent;
    let fixture: ComponentFixture<InputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InputComponent, FormsModule, ReactiveFormsModule],
        }).compileComponents();
        fixture = TestBed.createComponent(InputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit valueChange and call onChange on input', () => {
        spyOn(component.valueChange, 'emit');
        spyOn(component, 'onChange');
        const input = fixture.debugElement.query(By.css('input'));
        input.nativeElement.value = 'test';
        input.triggerEventHandler('input', { target: input.nativeElement });
        expect(component.valueChange.emit).toHaveBeenCalledWith('test');
        expect(component.onChange).toHaveBeenCalledWith('test');
    });
});
