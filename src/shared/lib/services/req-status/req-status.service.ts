import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReqStatusService {
    public readonly reqStatus: Subject<boolean> = new Subject;

    constructor() { }

    public emitReqStatus(req?: HttpRequest<unknown>) {
        this.reqStatus.next(false);
    }

    public emitRespStatus(req?: HttpRequest<unknown>) {
        this.reqStatus.next(true);
    }

}
