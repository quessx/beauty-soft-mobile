import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'body-in-page',
    templateUrl: './body-in-page.component.html',
    styleUrls: ['./body-in-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyInPageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
