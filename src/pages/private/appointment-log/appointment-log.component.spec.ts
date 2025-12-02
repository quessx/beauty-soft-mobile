import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentLogComponent } from './appointment-log.component';

describe('AppointmentLogComponent', () => {
    let component: AppointmentLogComponent;
    let fixture: ComponentFixture<AppointmentLogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppointmentLogComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AppointmentLogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
