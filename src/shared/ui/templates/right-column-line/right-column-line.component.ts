import { ChangeDetectionStrategy, Component, ElementRef, inject, input, InputSignal, Renderer2 } from '@angular/core';
import { TPropertyClassesRightColumn } from '@ui/templates/right-column-line/right-column-line.types';

@Component({
  selector: 'bsm-right-column-line',
  imports: [],
  templateUrl: './right-column-line.component.html',
  styleUrl: './right-column-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RightColumnLineComponent {
    private elementRef: ElementRef = inject(ElementRef);
    private renderer: Renderer2 = inject(Renderer2);
    public cssClasses: InputSignal<TPropertyClassesRightColumn> = input.required();

    ngOnInit(): void {
        this.renderer.addClass(this.elementRef.nativeElement, this.cssClasses());
    }
}
