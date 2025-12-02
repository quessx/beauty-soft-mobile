import { Component, computed, input, InputSignal, OnInit, Signal } from '@angular/core';
import { TRowType, TStrokeRow } from '@ui/templates/row/row.types';
import { RightColumnLineComponent } from '@ui/templates/right-column-line';
import { TextComponent } from '@ui/text';
import { TemplateLineComponent } from '@ui/templates/template-line';
import { LeftColumnForLineComponent } from '@ui/templates/left-column-for-line';

@Component( {
    selector: 'bsm-row',
    imports: [
        RightColumnLineComponent,
        LeftColumnForLineComponent,
        TextComponent,
        TemplateLineComponent
    ],
    templateUrl: './row.component.html',
    styleUrls: [ './row.component.scss' ],
    host: {
        '[class]': 'cssClasses()'
    }
} )
export class RowComponent implements OnInit {
    type: InputSignal<TRowType> = input.required();
    stroke: InputSignal<TStrokeRow> = input.required();
    leftText: InputSignal<string | undefined> = input();

    constructor() {
    }

    ngOnInit() {
    }

    protected cssClasses: Signal<string> = computed(() => {
        return `${ this.type() } ${ this.stroke() }`;
    });
}
