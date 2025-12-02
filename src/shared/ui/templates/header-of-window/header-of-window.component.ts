import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, OnInit, TemplateRef } from '@angular/core';

@Component({
    selector: 'header-of-window',
    templateUrl: './header-of-window.component.html',
    styleUrls: ['./header-of-window.component.scss'],
    imports: [NgTemplateOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderOfWindowComponent  implements OnInit {
    @ContentChild('firstSection', { static: true }) firstSection!: TemplateRef<any>;
    @ContentChild('secondSection', { static: true }) secondSection!: TemplateRef<any>;
    @ContentChild('thirdSection', { static: true }) thirdSection!: TemplateRef<any>;

    constructor() { }

    ngOnInit() {}

}
