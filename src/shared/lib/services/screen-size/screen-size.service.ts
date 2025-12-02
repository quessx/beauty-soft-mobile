import { inject, Injectable, Signal } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const BREAKPOINTS = {
    MOBILE: '(max-width: 600px)',
    TABLET: '(max-width: 1279px)',
} as const;

@Injectable({ providedIn: 'root' })
export class ScreenSizeService {
    private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
    private observer$: Observable<BreakpointState> = this.breakpointObserver.observe(Object.values(BREAKPOINTS));

    isMobile: Signal<boolean> = this.getBreakpointSignal('MOBILE');
    isTablet: Signal<boolean> = this.getBreakpointSignal('TABLET');

    private getBreakpointSignal(breakpoint: keyof typeof BREAKPOINTS): Signal<boolean> {
        return toSignal(this.observer$.pipe(map(state => state.breakpoints[BREAKPOINTS[breakpoint]])), {
            initialValue: this.breakpointObserver.isMatched(BREAKPOINTS[breakpoint]),
        });
    }
}
