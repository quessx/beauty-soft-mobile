import { Observable } from "rxjs";

export type THandlerReturn = void | Promise<unknown> | Observable<unknown>;
export type TStatus = 'def' | 'hover' | 'focus' | 'disabled' | 'icon-only';
export type TType = 'primary' | 'secondary' | 'destructive' | 'destructive-text' | 'tertiary';
