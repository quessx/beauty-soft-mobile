import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';
import { By } from '@angular/platform-browser';

describe('DropdownComponent', () => {
    let component: DropdownComponent;
    let fixture: ComponentFixture<DropdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DropdownComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(DropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit selectedChange when option is selected', () => {
        spyOn(component.selectedChange, 'emit');
        const select = fixture.debugElement.query(By.css('select'));
        select.triggerEventHandler('change', { target: { value: 'test' } });
        expect(component.selectedChange.emit).toHaveBeenCalledWith('test');
    });
});
