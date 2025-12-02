import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[beauty-emotion-sad-line]',
  imports: [],
  templateUrl: './emotion-sad-line.component.svg',
  styleUrl: './emotion-sad-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        xmlns: "http://www.w3.org/2000/svg",
        width: "56",
        height: "56",
        viewBox: "0 0 56 56",
        fill: "none"
    },
})
export class EmotionSadLineComponent {

}
