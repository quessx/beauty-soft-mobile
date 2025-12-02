import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { weekdays } from '@lib/const/date';

@Component({
    selector: 'bsm-week-header',
    imports: [],
    templateUrl: './week-header.component.html',
    styleUrl: './week-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekHeaderComponent {
    week: string = '';
    day: string = '';
    @Input() set arg(it: { date: Date; }) {
        if (!it.date) {
            return;
        }
        
        [this.week, this.day] = [weekdays[it.date.getDay()], it.date.getDate().toString()];
        this.cdr.markForCheck();
    }

    constructor(private cdr: ChangeDetectorRef) {

    }
}