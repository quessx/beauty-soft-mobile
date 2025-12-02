import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable()
export class LoadDataService {

    constructor() { }

    loadData(): Observable<boolean> {
        return of(true);
    }
}
