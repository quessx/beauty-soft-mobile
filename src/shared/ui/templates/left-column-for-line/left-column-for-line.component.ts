import { ChangeDetectionStrategy, Component, ElementRef, inject, input, InputSignal, Renderer2 } from '@angular/core';
import { TPropertyClassesLeftColumnForLine } from '@ui/templates/left-column-for-line/left-column-for-line.types';

@Component({
  selector: 'bsm-left-column-for-line',
  imports: [],
  templateUrl: './left-column-for-line.component.html',
  styleUrl: './left-column-for-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftColumnForLineComponent {
    private elementRef: ElementRef = inject(ElementRef);
    private renderer: Renderer2 = inject(Renderer2);
    public cssClasses: InputSignal<TPropertyClassesLeftColumnForLine> = input.required();

    ngOnInit(): void {
        this.renderer.addClass(this.elementRef.nativeElement, this.cssClasses());
    }
}
