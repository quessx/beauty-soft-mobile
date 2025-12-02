import {
    Component,
    OnInit,
    Input,
    HostListener,
    EventEmitter,
    Output,
    ChangeDetectionStrategy
} from '@angular/core';
import { SpinnerIconComponent } from '@icons/spinner-icon';

@Component({
    selector: 'sensei-default-overlay',
    templateUrl: './default-overlay.component.html',
    standalone: true,
    imports: [SpinnerIconComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./default-overlay.component.css']
})
export class DefaultOverlayComponent implements OnInit {
    @Output() closeModal = new EventEmitter<boolean>();
    @Input() set _spinnerOff(e: boolean) {
        this.spinnerOff = e;
    }

    spinnerOff: boolean = true;

    constructor() {}

    @HostListener('mousedown', ['$event']) onMousedown($event: MouseEvent): void {
        $event.stopPropagation();
        this.closeModal.next(true);
    }

    @HostListener('mouseup', ['$event']) onMouseup($event: MouseEvent): void {
        $event.stopPropagation();
        this.closeModal.next(true);
    }

    ngOnInit(): void {
    }
}
