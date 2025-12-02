import { Component, EventEmitter, HostBinding, OnInit, Output, signal, WritableSignal } from "@angular/core";
import { Observable } from "rxjs";


@Component({
    template: ''
})
export abstract class BaseWidget implements OnInit {
    @Output() public init: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected isLoading: WritableSignal<boolean> = signal(false);

    protected showAfterLoading: boolean = false;
    @HostBinding('style.visibility') get visibility() {
        if(!this.showAfterLoading) {
            return 'visible';
        }
        return this.isLoading() ? 'visible' : 'hidden';
    }

    abstract preload(): Observable<boolean>;

    ngOnInit(): void {
        this.preload().subscribe((result: boolean) => {
            this.isLoading.set(result);
            this.init.emit(result);
        });
    }

}