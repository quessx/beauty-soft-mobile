import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'svg[bsm-back-icon]',
    templateUrl: './back-icon.component.svg',
    styleUrls: ['./back-icon.component.scss'],
    host: {
        width: '36',
        height: '36',
        viewBox: '0 0 36 36',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg'
    }
})
export class BackIconComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
