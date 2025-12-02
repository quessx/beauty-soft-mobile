import {
    booleanAttribute,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    input,
    InputSignal,
    model,
    PLATFORM_ID,
    signal,
    Signal,
    untracked,
    WritableSignal
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { auditTime, pairwise } from 'rxjs';

@Component({
    template: '',
    styleUrls: ['./base-slider.component.scss'],
    host: {
        '[style.column-gap]': 'spaceBetween() + "px"',
        '(pointerdown)': 'onPointerDown($event)',
        '(pointermove)': 'onPointerMove($event)',
        '(pointerup)': 'onPointerUp($event)',
        '(pointerleave)': 'onPointerUp($event)',
        '(pointercancel)': 'onPointerUp($event)',
        '(window:keydown)': 'onKeyDown($event)',
    }
})
export abstract class BaseSlider {
    protected destroyRef = inject(DestroyRef);
    protected platformId = inject(PLATFORM_ID);
    protected elementRef: ElementRef<HTMLElement> = inject(ElementRef);

    public currentIndex = model<number>(0);
    public swipeSizePx = input<number>(30);
    public onlyPaginator = input(false, { transform: booleanAttribute });
    public withKeyboard = input(false, { transform: booleanAttribute });
    public abstract spaceBetween: InputSignal<number>;
    public abstract neighborSlideWidthPercent: InputSignal<number>;

    protected abstract totalSlides: Signal<number>;
    protected flexBasis: Signal<string> = computed(() => {
        return 100 - this.neighborSlideWidthPercent() + '%';
    });

    public transformValue: Signal<string> = computed((): string => {
        let index: number = this.currentIndex();
        let gapOffset: number = index * this.spaceBetween();
        let gapEndSlideOffset: number =
            gapOffset - (this.elementRef.nativeElement.clientWidth / 100) * this.neighborSlideWidthPercent();
        let getTransformValue = (baseOffset: number, startOffset: number = baseOffset): string => {
            if (index === 0) {
                return `${startOffset}%`;
            } else if (this.totalSlides() - 1 === index || this.direction === 'left') {
                return `calc(${baseOffset}% - ${gapEndSlideOffset}px)`;
            }
            return `calc(${baseOffset}% - ${gapOffset}px)`;
        };

        let baseOffset: number = -index * 100;

        return this.isDragging()
            ? getTransformValue(baseOffset + (this.deltaXTransform() / window.innerWidth) * 100)
            : getTransformValue(baseOffset, 0);
    });

    protected isDragging: WritableSignal<boolean> = signal<boolean>(false);
    private deltaX: WritableSignal<number> = signal<number>(0);
    private deltaY: WritableSignal<number> = signal<number>(0);
    protected deltaXTransform: WritableSignal<number> = signal<number>(0);
    protected deltaYTransform: WritableSignal<number> = signal<number>(0);
    protected direction: 'left' | 'right' = 'right';
    protected pointers = new Map<number, PointerEvent>();

    private startX: number = 0;
    private startY: number = 0;

    protected constructor() {
        toObservable(this.currentIndex)
            .pipe(pairwise())
            .subscribe(([prevValue, currentValue]: [number, number]) => {
                if (prevValue <= currentValue) {
                    this.direction = 'right';
                } else {
                    this.direction = 'left';
                }
            });

        toObservable(this.deltaX)
            .pipe(auditTime(50))
            .subscribe((value: number) => {
                this.deltaXTransform.set(value);
            });

        toObservable(this.deltaY)
            .pipe(auditTime(50))
            .subscribe((value: number) => {
                this.deltaYTransform.set(value);
            });
    }

    public nextSlide(): void {
        if (this.currentIndex() < this.totalSlides() - 1) {
            untracked(() => {
                this.currentIndex.update(value => value + 1);
            });
        }
    }

    public previousSlide(): void {
        if (this.currentIndex() > 0) {
            untracked(() => {
                this.currentIndex.update(value => value - 1);
            });
        }
    }

    public slideTo(index: number): void {
        if (index < this.totalSlides()) {
            untracked(() => {
                this.currentIndex.set(index);
            });
        } else {
            console.error("The index is out of the slider's range");
        }
    }

    protected onPointerDown(event: PointerEvent | TouchEvent): void {
        if (this.onlyPaginator()) {
            return;
        }
        if (event instanceof PointerEvent) {
            this.modifyPointers(event.pointerId, event);
            this.startX = event.clientX;
            this.startY = event.clientY;
        } else {
            this.startX = event.changedTouches[0].clientX;
            this.startY = event.changedTouches[0].clientY;
        }
        this.isDragging.set(true);
    }

    protected onPointerMove(event: PointerEvent): boolean {
        if (!this.isDragging() || this.onlyPaginator() || !this.pointers.has(event.pointerId)) {
            return false;
        }

        if (this.pointers.size === 1) {
            this.deltaX.set(event.clientX - this.startX);
            this.deltaY.set(event.clientY - this.startY);
            if (Math.abs(this.deltaX()) > this.swipeSizePx() * 2) {
                this.deltaY.set(0);
            } else if (Math.abs(this.deltaY()) > this.swipeSizePx() * 2) {
                this.deltaX.set(0);
            }
        }
        return true;
    }

    protected onPointerUp(event: PointerEvent): boolean {
        if (this.onlyPaginator()) {
            return false;
        }

        this.modifyPointers(event.pointerId);
        if (this.pointers.size === 0) {
            if (this.deltaX() < -this.swipeSizePx() && this.currentIndex() < this.totalSlides() - 1) {
                this.currentIndex.update(i => i + 1);
            } else if (this.deltaX() > this.swipeSizePx() && this.currentIndex() > 0) {
                this.currentIndex.update(i => i - 1);
            }

            this.isDragging.set(false);
            this.deltaX.set(0);
            this.deltaY.set(0);
        }
        return true;
    }

    protected onKeyDown($event: KeyboardEvent): void {
        if (!this.withKeyboard()) {
            return;
        }
        if ($event.key === 'ArrowLeft') {
            this.previousSlide();
        } else if ($event.key === 'ArrowRight') {
            this.nextSlide();
        }
    }

    protected modifyPointers(pointerId: number, event?: PointerEvent): void {
        if (event) {
            this.pointers.set(event.pointerId, event);
        } else {
            this.pointers.delete(pointerId);
        }
    }
}
