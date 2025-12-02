import { ChangeDetectionStrategy, Component, inject, ViewChild, ElementRef, OnDestroy, Renderer2, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TLensQueueItem, TLensScrollPosition } from './types/lens.types';
import { LensDataService } from './services/lens-data.service';

@Component({
    selector: 'bsm-lens',
    imports: [],
    templateUrl: './lens.component.html',
    styleUrl: './lens.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LensComponent implements OnDestroy {
    @Input('ref-width') set refWidth(value: string) {
        this._refWidth = parseInt(value, 10) || 175;
        this.renderer.setStyle(this.elRef.nativeElement, 'width', `${this._refWidth + 2}px`);
    }
    @Input('default-column-width') defaultColumnWidth: string = '142';
    @Input() set setScrollPosition(scrollPosition: TLensScrollPosition) {
        this.handleScrollPosition(scrollPosition);
    }
    private lensDataService: LensDataService = inject(LensDataService);
    private elRef: ElementRef<HTMLElement> = inject(ElementRef);
    private renderer: Renderer2 = inject(Renderer2);
    private subs: Subscription = new Subscription();
    private _refWidth: number = 175;

    @ViewChild('headerContainer', { static: true }) private headerContainer!: ElementRef<HTMLDivElement>;
    @ViewChild('bodyContainer', { static: true }) private bodyContainer!: ElementRef<HTMLDivElement>;
    @ViewChild('scrollBodyContainer', { static: true }) private scrollBodyContainer!: ElementRef<HTMLDivElement>;
    @ViewChild('scrollHeaderContainer', { static: true }) private scrollHeaderContainer!: ElementRef<HTMLDivElement>;

    private headerClone: HTMLElement | null = null;
    private bodyClone: HTMLElement | null = null;
    private prependHeaderElement: HTMLCollection | null = null;
    // track original source elements and their observers so we can react to changes
    private prevHeaderSource: HTMLElement | null = null;
    private prevBodySource: HTMLElement | null = null;
    private headerObserver: MutationObserver | null = null;
    private bodyObserver: MutationObserver | null = null;

    constructor() {
        this.lensDataService.onScrollPositionChange(this.handleScrollPosition.bind(this));
        this.subs.add(
            this.lensDataService.getLensQueue().subscribe((lensItem: TLensQueueItem | undefined) => {
                if (!lensItem) {
                    return;
                }
                
                // Attach observers to original source elements before cloning so we can re-clone on changes.
                const headerSource: HTMLElement | undefined = lensItem.header && lensItem.header.length ? (lensItem.header[0] as HTMLElement) : undefined;
                const bodySource: HTMLElement | undefined = lensItem.body && lensItem.body.length ? (lensItem.body[0] as HTMLElement) : undefined;

                // If header source changed reference, remove previous observer and attach a new one
                if (headerSource && headerSource !== this.prevHeaderSource) {
                    this.disconnectHeaderObserver();
                    this.prevHeaderSource = headerSource;
                    this.headerObserver = new MutationObserver((mutations: MutationRecord[]) => {
                        if (!this.shouldRecreate(mutations)) {
                            return;
                        }
                        // Recreate header clone on meaningful source mutation
                        requestAnimationFrame(() => {
                            try {
                                const newClone = this.prevHeaderSource?.cloneNode(true) as HTMLElement | undefined;
                                if (!newClone) { return; }
                                // replace header clone
                                if (this.scrollHeaderContainer?.nativeElement) {
                                    this.renderer.setProperty(this.scrollHeaderContainer.nativeElement, 'innerHTML', '');
                                    this.applyHeaderCloneWidths(newClone);
                                    this.renderer.appendChild(this.scrollHeaderContainer.nativeElement, newClone);
                                    this.headerClone = newClone;
                                }
                            } catch (err) { /* ignore */ }
                        });
                    });
                    try {
                        this.headerObserver.observe(headerSource, { attributes: true, childList: true, subtree: true, characterData: true });
                    } catch (e) { /* ignore */ }
                }

                // If body source changed reference, remove previous observer and attach a new one
                if (bodySource && bodySource !== this.prevBodySource) {
                    this.disconnectBodyObserver();
                    this.prevBodySource = bodySource;
                    this.bodyObserver = new MutationObserver((mutations: MutationRecord[]) => {
                        if (!this.shouldRecreate(mutations)) {
                            return;
                        }
                        // Recreate body clone on meaningful source mutation
                        requestAnimationFrame(() => {
                            try {
                                const newClone = this.prevBodySource?.cloneNode(true) as HTMLElement | undefined;
                                if (!newClone) { return; }
                                // replace body clone
                                if (this.scrollBodyContainer?.nativeElement) {
                                    this.renderer.setProperty(this.scrollBodyContainer.nativeElement, 'innerHTML', '');
                                    this.applyHeaderCloneWidths(newClone, '.fc-day');
                                    this.renderer.appendChild(this.scrollBodyContainer.nativeElement, newClone);
                                    this.bodyClone = newClone;
                                }
                            } catch (err) { /* ignore */ }
                        });
                    });
                    try {
                        this.bodyObserver.observe(bodySource, { attributes: true, childList: true, subtree: true, characterData: true });
                    } catch (e) {
                        /* ignore */ 
                    }
                }

                // If we haven't rendered clones yet, do initial clone and append
                if (!this.prependHeaderElement && headerSource && bodySource && lensItem.header?.length) {
                    try {
                        this.headerClone = headerSource.cloneNode(true) as HTMLElement;
                        this.bodyClone = bodySource.cloneNode(true) as HTMLElement;
                        this.applyHeaderCloneWidths(this.headerClone);
                        this.applyHeaderCloneWidths(this.bodyClone, '.fc-day');
                        this.appendClones();
                        this.prependHeaderElement = lensItem.header;
                    } catch (err) {
                        // ignore cloning errors
                    }
                }
            })
        );
    }

    private disconnectHeaderObserver(): void {
        if (this.headerObserver) {
            try {
                this.headerObserver.disconnect();
            } catch (e) {
                /* ignore */
            }
        }
        this.headerObserver = null;
    }

    private disconnectBodyObserver(): void {
        if (this.bodyObserver) {
            try {
                this.bodyObserver.disconnect();
            } catch (e) {
                /* ignore */
            }
        }
        this.bodyObserver = null;
    }

    private clearContainers(): void {
        // Use body container length as source of truth
        const bodyEl: HTMLDivElement | undefined = this.scrollBodyContainer?.nativeElement;
        const headerEl: HTMLDivElement | undefined = this.scrollHeaderContainer?.nativeElement;
        if (bodyEl) {
            this.renderer.setProperty(bodyEl, 'innerHTML', '');
        }
        if (headerEl) {
            this.renderer.setProperty(headerEl, 'innerHTML', '');
        }
    }

    private handleScrollPosition(scrollPosition: TLensScrollPosition): void {
        if (!scrollPosition) {
            return;
        }
        
        const incomingX: number = scrollPosition.x ?? 0;
        // incomingX was calculated using columns sized by defaultColumnWidth (string), convert to number
        const defaultColW: number = Number(this.defaultColumnWidth) || 142;
        // scale scroll to this view which uses this._refWidth per column
        const scaledX: number = Math.round(incomingX * (this._refWidth / defaultColW));

        this.scrollBodyContainer.nativeElement.scrollTo({ left: scaledX, top: scrollPosition.y, behavior: 'auto' });
        this.scrollHeaderContainer.nativeElement.scrollTo({ left: scaledX, top: 0, behavior: 'auto' });
    }

    private applyHeaderCloneWidths(headerClone: HTMLElement | null, cellSelector: string = '.fc-col-header-cell'): void {
        if (!headerClone) {
            return;
        }

        headerClone.removeAttribute('style');
        // Remove all inline styles and set pointer-events: none for headerClone and its children
        const removeStylesAndDisablePointerEvents = (el: HTMLElement): void => {
            el.style.pointerEvents = 'none';
            const children: HTMLCollection = el.children;
            for (let i: number = 0; i < children.length; i++) {
                removeStylesAndDisablePointerEvents(children[i] as HTMLElement);
            }
        };
        removeStylesAndDisablePointerEvents(headerClone);

        const cells: NodeListOf<HTMLElement> = headerClone.querySelectorAll(cellSelector) as NodeListOf<HTMLElement>;
        if (!cells || cells.length === 0) {
            return;
        }
        
        const widthPx: string = `${this._refWidth}px`;
        let totalWidth: number = 0;

        cells.forEach((cell: HTMLElement) => {
            this.setStyle(cell, 'width', widthPx);
            totalWidth += +this._refWidth;
        });

        const minWidthPx: string = `${totalWidth}px`;
        this.setStyle(headerClone, 'min-width', minWidthPx);
        this.setStyle(headerClone, 'width', minWidthPx);

        // If the clone contains table elements (bodyClone case) assign total width to those tables
        const tables: NodeListOf<HTMLTableElement> = headerClone.querySelectorAll('table') as NodeListOf<HTMLTableElement>;
        if (tables && tables.length >= 1) {
            tables.forEach((t: HTMLTableElement) => {
                this.setStyle(t as unknown as HTMLElement, 'min-width', minWidthPx);
                this.setStyle(t as unknown as HTMLElement, 'width', minWidthPx);
            });
        }
    }

    private appendClones(y?: number): void {
        if (this.headerClone && this.scrollHeaderContainer?.nativeElement) {
            this.renderer.appendChild(this.scrollHeaderContainer.nativeElement, this.headerClone);
            this.scrollHeaderContainer.nativeElement.scrollTo({ left: this.headerClone.scrollLeft, top: 0, behavior: 'auto' });
            
        }
        if (this.bodyClone && this.scrollBodyContainer?.nativeElement) {
            this.scrollBodyContainer.nativeElement.scrollTo({ left: this.bodyClone.scrollLeft, top: y ?? this.bodyClone.scrollTop, behavior: 'auto' });
            this.renderer.appendChild(this.scrollBodyContainer.nativeElement, this.bodyClone);
        }
    }

    private setStyle(element: HTMLElement | null, style: string, value: string): void {
        if (!element) {
            return;
        }
        try {
            this.renderer.setStyle(element, style, value);
        } catch (e) {
            ((element as HTMLElement).style as any)[style as keyof CSSStyleDeclaration] = value;
        }
    }

    // Decide whether mutations warrant recreating the clone.
    // Ignore pure style attribute changes; react to structural/content changes.
    private shouldRecreate(mutations: MutationRecord[]): boolean {
        if (!mutations || mutations.length === 0) { return false; }
        for (const m of mutations) {
            if (m.type === 'childList') { return true; }
            if (m.type === 'characterData') { return true; }
            if (m.type === 'attributes') {
                const attrName = (m as MutationRecord & { attributeName?: string }).attributeName;
                if (attrName && attrName.toLowerCase() === 'style') {
                    // ignore style-only changes
                    continue;
                }
                return true;
            }
        }
        return false;
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
        this.clearContainers();
        this.disconnectHeaderObserver();
        this.disconnectBodyObserver();
    }
}
