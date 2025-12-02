import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { signal } from '@angular/core';

import { SelectionSummaryComponent } from './selection-summary.component';
import { AppointmentDataService } from '@lib/services/appointment';
import { SelectionAggregate } from '@features/add-order-feature';

describe ( 'SelectionSummaryComponent', () => {
    let component: SelectionSummaryComponent;
    let fixture: ComponentFixture<SelectionSummaryComponent>;

    beforeEach ( async () => {
        const mockAppointmentDataService: any = {
            getForm: () => new FormGroup ( {
                selected_services: new FormControl ( [] )
            } ),
            selectedServices: {
                controls: []
            }
        };

        await TestBed.configureTestingModule ( {
            imports: [SelectionSummaryComponent],
            providers: [
                { provide: AppointmentDataService, useValue: mockAppointmentDataService }
            ]
        } ).compileComponents ( );

        fixture = TestBed.createComponent ( SelectionSummaryComponent );
        component = fixture.componentInstance;
        
        // Устанавливаем обязательный input
        const mockAggregate: SelectionAggregate = {
            serviceIds: [],
            goodIds: [],
            serviceTotal: 0,
            goodsTotal: 0
        };
        fixture.componentRef.setInput ( 'aggregate', mockAggregate );
        fixture.detectChanges ( );
    } );

    it ( 'should create', () => {
        expect ( component ).toBeTruthy ( );
    } );

    it ( 'should calculate hasItems correctly', () => {
        const aggregateWithItems: SelectionAggregate = {
            serviceIds: ['service1'],
            goodIds: ['good1'],
            serviceTotal: 100,
            goodsTotal: 50
        };
        
        fixture.componentRef.setInput ( 'aggregate', aggregateWithItems );
        fixture.detectChanges ( );
        
        expect ( component.hasItems ( ) ).toBeTruthy ( );
    } );

    it ( 'should calculate totalAmount correctly', () => {
        const aggregateWithItems: SelectionAggregate = {
            serviceIds: ['service1'],
            goodIds: ['good1'],
            serviceTotal: 100,
            goodsTotal: 50
        };
        
        fixture.componentRef.setInput ( 'aggregate', aggregateWithItems );
        fixture.detectChanges ( );
        
        expect ( component.totalAmount ( ) ).toBe ( 150 );
    } );

    it ( 'should emit remove event', () => {
        spyOn ( component.remove, 'emit' );
        
        const event: Event = new Event ( 'click' );
        component.onRemove ( event, 'test-id' );
        
        expect ( component.remove.emit ).toHaveBeenCalledWith ( 'test-id' );
    } );
});
