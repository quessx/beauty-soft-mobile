import {
    booleanAttribute,
    Component,
    computed,
    contentChildren,
    effect,
    ElementRef,
    input,
    InputSignal
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatestWith, filter } from 'rxjs';
import { BaseSlider } from '@ui/sliders/base-slider/base-slider.component';

@Component({
    selector: 'bsm-content-slider',
    templateUrl: './content-slider.component.html',
    styleUrl: '../base-slider/base-slider.component.scss',
    host: {
        '[style.transition]': 'withAutoHeight() ? "height 0.3s" : "unset"',
    },
})
export class ContentSliderComponent extends BaseSlider {
    override spaceBetween: InputSignal<number> = input<number>(0);
    override neighborSlideWidthPercent: InputSignal<number> = input<number>(0);
    withAutoHeight = input(false, { transform: booleanAttribute });

    private slides = contentChildren('slide', { read: ElementRef<HTMLElement> });
    protected override totalSlides = computed((): number => {
        return this.slides().length;
    });

    private resizeObserver: ResizeObserver | undefined;

    constructor() {
        super();
        this.addInitialisationHandler();
        if (!isPlatformServer(this.platformId)) {
            this.addAutoHeightHandler();
        }
        this.addTransformChangeHandler();

        this.destroyRef.onDestroy(() => {
            this.resizeObserver?.disconnect();
        });
    }

    private addInitialisationHandler(): void {
        toObservable(this.slides)
            .pipe(
                combineLatestWith(toObservable(this.flexBasis), toObservable(this.withAutoHeight)),
                takeUntilDestroyed()
            )
            .subscribe(([slides, flexBasis, autoHeight]) => {
                slides.forEach(slide => {
                    slide.nativeElement.classList.add('slide');
                    slide.nativeElement.style.cursor = 'default';
                    slide.nativeElement.style.flexBasis = flexBasis;
                    if (autoHeight) {
                        slide.nativeElement.style.height = 'fit-content';
                    }
                });
            });
    }

    private addAutoHeightHandler(): void {
        toObservable(this.currentIndex)
            .pipe(
                combineLatestWith(toObservable(this.slides)),
                filter(([index, slides]) => !!slides.length)
            )
            .subscribe(([index, slides]) => {
                slides.forEach((slide, ind) => {
                    slide.nativeElement.inert = ind !== index;
                });
                if (this.withAutoHeight()) {
                    this.resizeObserver?.disconnect();
                    this.resizeObserver = new ResizeObserver(() => {
                        this.elementRef.nativeElement.style.height =
                            this.slides()[index].nativeElement.clientHeight + 'px';
                    });
                    this.resizeObserver.observe(this.slides()?.[index]?.nativeElement);
                }
            });
    }

    private addTransformChangeHandler(): void {
        effect(() => {
            this.slides().forEach(slide => {
                slide.nativeElement.style.transform = `translateX(${this.transformValue()})`;
            });
        });
    }
}
