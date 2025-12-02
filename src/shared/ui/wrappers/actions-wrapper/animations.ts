import { forkJoin, from, Observable, Observer } from "rxjs";

export const WRAPPER_BASE_DURATION: number = 300;

export function animateCancel( child: Element, duration: number ): Observable<[Animation, Animation]> {
    return forkJoin( [
        from(
            child.animate( [
                { transform: 'translateY(100%)' }
            ], { duration: duration, fill: 'forwards' } ).finished
        ),
        from(
            ( child.parentElement || child ).animate( [
                { opacity: 0 }
            ], { duration: duration, fill: 'forwards' } ).finished
        )
    ] );
}
