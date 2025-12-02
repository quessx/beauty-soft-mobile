import { LensService } from "../lens";
import { DAY_ACTIVE_WIDTH, DAY_MIN_WIDTH } from "@features/appointment-log-schedule-feature/types/width.const";
import BScroll from "better-scroll";

export class ScheduleMobileScroll {
    private activeColumnEl: HTMLElement | null = null;
    private activeHeaderEl: HTMLElement | null = null;
    private activeElIndex: number = 0;
    private ticking: boolean = false;
    private lensService: LensService;
    private subscriptions: Array<{ unsubscribe: () => void }> = [];
    private readonly HEADER_SCROLLER_INDEX: number = 1;
    private readonly BODY_SCROLLER_INDEX: number = 3;
    private readonly IS_ADMIN: boolean = false;
    private dayActiveWidth: number = DAY_ACTIVE_WIDTH;
    private dayMinWidth: number = DAY_MIN_WIDTH;
    private bsScroll: BScroll | null = null;

    constructor(
        private headers: NodeListOf<HTMLElement>,
        lensService: LensService,
        dayActiveWidth: number = DAY_ACTIVE_WIDTH,
        dayMinWidth: number = DAY_MIN_WIDTH,
        isAdmin: boolean = false
    ) {
        this.lensService = lensService;
        this.IS_ADMIN = isAdmin;
        this.dayActiveWidth = dayActiveWidth;
        this.dayMinWidth = dayMinWidth;
        this.init();
    }

    private init(): void {
        if (!this.headers) {
            return;
        }
        this.setScrollByBsScroll();
    }

    private setScrollByBsScroll(): void {
        if (!this.headers || this.headers.length <= this.BODY_SCROLLER_INDEX) {
            return;
        }

        this.headers[this.BODY_SCROLLER_INDEX].scrollLeft = 0;
        this.headers[this.HEADER_SCROLLER_INDEX].scrollLeft = 0;

        const activeWidth: string = `${this.dayActiveWidth}px`;
        const defaultWidth: string = `${this.dayMinWidth}px`;
        const getBodyCols = (): HTMLElement[] => Array.from(this.headers[this.BODY_SCROLLER_INDEX].querySelectorAll('.fc-day')) as HTMLElement[];
        const getHeaderCols = (): HTMLElement[] => Array.from(this.headers[this.HEADER_SCROLLER_INDEX].querySelectorAll('.fc-col-header-cell')) as HTMLElement[];
        const bodyCols: HTMLElement[] = getBodyCols();
        const headerCols: HTMLElement[] = getHeaderCols();

        // Set all cells to the minimum width
        bodyCols.forEach((col) => col.style.width = defaultWidth);
        headerCols.forEach((col) => col.style.width = defaultWidth);

        this.activeColumnEl = bodyCols[0];
        this.activeHeaderEl = headerCols[0];
        this.activeColumnEl.style.width = activeWidth;
        this.activeHeaderEl.style.width = activeWidth;

        this.lensService.enqueueLensItem({
            header: this.headers[1].children,
            body: this.headers[this.BODY_SCROLLER_INDEX].children,
        });

        this.bsScroll = new BScroll(this.headers[this.BODY_SCROLLER_INDEX], {
            startX: 0,
            startY: 0,
            scrollX: true,
            scrollY: true,
            probeType: 3,
            click: true,
            observeDOM: true,
            bounce: {
                top: false,
                bottom: false,
                left: false,
                right: false
            }
        });
        this.bsScroll?.scrollTo(0, 0, 500);
        this.lensService.setScrollPosition({ x: 0, y: 0 });
        this.headers[this.BODY_SCROLLER_INDEX].scrollTop = 0;

        const scrollEndHandler: Function = (position: { x: number; y: number }) => {
            this.ticking = false;
            const bodyCols: HTMLElement[] = getBodyCols();
            const headerCols: HTMLElement[] = getHeaderCols();
            const scrollLeft: number = position.x < 0 ? -position.x : 0;
            const baseIndex: number = Math.floor(scrollLeft / this.dayMinWidth);
            const remainder: number = scrollLeft - baseIndex * this.dayMinWidth;
            const half: number = this.dayMinWidth / 2;
            // If remainder is >= half, round up, otherwise round down
            let targetIndex: number = remainder >= half ? baseIndex + 1 : baseIndex;
            // Clamp index to available columns
            const maxIndex: number = Math.max(0, bodyCols.length - 1);
            if (targetIndex < 0) {
                targetIndex = 0;
            }
            if (targetIndex > maxIndex) {
                targetIndex = maxIndex;
            }

            let isChangedActiveEl: boolean = targetIndex !== this.activeElIndex;

            this.activeElIndex = targetIndex;
            const leftDistance: number = (this.activeElIndex * this.dayMinWidth);

            if (!isChangedActiveEl && scrollLeft === leftDistance ) {
                return;
            }

            if (this.activeHeaderEl && this.activeColumnEl) {
                this.activeHeaderEl.style.width = defaultWidth;
                this.activeColumnEl.style.width = defaultWidth;
            }
            this.activeHeaderEl = headerCols[this.activeElIndex];
            this.activeColumnEl = bodyCols[this.activeElIndex];
            this.activeHeaderEl.style.width = activeWidth;
            this.activeColumnEl.style.width = activeWidth;
            this.bsScroll?.scrollTo(-leftDistance, position.y, 500);
        };

        const scrollHandler: Function = (position: { x: number; y: number }): void => {
            const bodyCols: HTMLElement[] = getBodyCols();
            const headerCols: HTMLElement[] = getHeaderCols();

            const scrollX: number = -position.x;
            const activeElIndex: number = Math.ceil(scrollX / this.dayMinWidth);
            const isChangedActiveEl: boolean = activeElIndex !== this.activeElIndex;
            this.lensService.setScrollPosition({ x: scrollX, y: -position.y });
            this.headers[this.BODY_SCROLLER_INDEX].scrollLeft = 0;
            this.headers[this.BODY_SCROLLER_INDEX].scrollTop = 0;
            this.copyBodyScrollerStyleToHeader();
            this.headers[2].scrollTop = -position.y;

            if (this.ticking || !isChangedActiveEl || !this.activeHeaderEl || !this.activeColumnEl) {
                return;
            }

            this.activeHeaderEl.style.width = defaultWidth;
            this.activeColumnEl.style.width = defaultWidth;
            this.activeHeaderEl = headerCols[0];
            this.activeColumnEl = bodyCols[0];
            this.activeHeaderEl.style.width = activeWidth;
            this.activeColumnEl.style.width = activeWidth;
            this.ticking = true;
        };


        this.bsScroll?.on('scroll', (position: { x: number; y: number }) => {
            scrollHandler(position);
        });

        this.bsScroll?.on('scrollEnd', (position: { x: number; y: number }) => {
            scrollEndHandler(position);
        });
    }

    private copyBodyScrollerStyleToHeader(): void {
        const bodyScroller: HTMLElement = this.headers[this.BODY_SCROLLER_INDEX];
        const headerScroller: HTMLElement = this.headers[this.HEADER_SCROLLER_INDEX];
        let copyStyles: string | null = bodyScroller.children[0].getAttribute('style');
        if (copyStyles) {
            copyStyles = copyStyles.replace(/translateY\([^)]*\)/g, 'translateY(0px)');
        }
        headerScroller.children[0].setAttribute('style', copyStyles || '');
    }

    // Call to cleanup subscriptions when this class is no longer used
    public destroy(): void {
        this.subscriptions.forEach((s) => {
            try { s.unsubscribe(); } catch (e) { /* ignore */ }
        });
        this.subscriptions = [];
        if (this.bsScroll) {
            this.bsScroll.stop();
            this.bsScroll.destroy();
            this.bsScroll = null;
        }
    }
}
