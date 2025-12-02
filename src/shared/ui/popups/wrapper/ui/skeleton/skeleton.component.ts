import { Component } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component( {
    selector: 'bsm-skeleton',
    templateUrl: './skeleton.component.html',
    styleUrls: ['./skeleton.component.scss'],
    imports: [Skeleton],
} )
export class SkeletonComponent {
    protected items: number[] = Array.from( { length: 15 }, () => Math.floor( Math.random() * 3 ) + 1 );

    constructor() {
    }

    protected getWidth( it: number ): string {
        switch ( it ) {
            case 1:
                return '98px';
            case 2:
                return '146px';
            default:
                return '194px';
        }
    }
}
