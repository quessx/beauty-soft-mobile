import { ChangeDetectionStrategy, Component, ElementRef, inject, input, InputSignal, Renderer2 } from '@angular/core';
import { TStrokeTemplateLine, TTypeTemplateLine } from '@ui/templates/template-line/template-line.types';

@Component({
  selector: 'bsm-template-line',
  imports: [],
  templateUrl: './template-line.component.html',
  styleUrl: './template-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateLineComponent {
    type: InputSignal<TTypeTemplateLine> = input.required();
    stroke: InputSignal<TStrokeTemplateLine> = input.required();

    private elementRef: ElementRef = inject(ElementRef);
    private renderer: Renderer2 = inject(Renderer2);

    ngOnInit(): void {
        this.renderer.addClass(this.elementRef.nativeElement, this.type());
        this.renderer.addClass(this.elementRef.nativeElement, this.stroke());
    }
}
