import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Output } from '@angular/core';
import { InputComponent, TInputTypeIcons } from '@ui/form-elements';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, pairwise, startWith } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'bsm-search-input',
    imports: [InputComponent, ReactiveFormsModule],
    templateUrl: './search-input.component.html',
    styleUrl: './search-input.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchInputComponent {
    private route: ActivatedRoute = inject(ActivatedRoute);
    @Output() searchValue: EventEmitter<string> = new EventEmitter<string>();
    public control: FormControl<string | null> = new FormControl('');
    protected inputTypeIcons: TInputTypeIcons = { isNeedLoupeIcon: true };

    constructor(private el: ElementRef) {
        let startingValue: string = this.route.snapshot.queryParamMap.get('q') || '';
        this.control.valueChanges.pipe(
            takeUntilDestroyed(),
            debounceTime(300),
            distinctUntilChanged(),
            startWith(startingValue),
            pairwise(),
            filter(([prev, next]: [string | null, string | null]) => prev !== next),
        ).subscribe(([prev, next]: [string | null, string | null]) => {
            this.searchValue.emit(next || '');
        });
        this.control.setValue(startingValue);
    }

    onInput(event: Event): void {
        if (event.target instanceof HTMLInputElement) {
            this.control.setValue(event.target.value.trimStart().toLowerCase());
        }
    }

    clearInput(): void {
        this.control.setValue('');
    }
}
