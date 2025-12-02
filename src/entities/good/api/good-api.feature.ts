import { patchState, signalStoreFeature, withMethods } from "@ngrx/signals";
import { inject } from "@angular/core";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { catchError, exhaustMap, filter, finalize, pipe, tap, throwError } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { removeEntity, setAllEntities, setEntity } from "@ngrx/signals/entities";
import { DefaultOverlayService } from "@lib/services/default-overlay";
import { ApiGoodsGetCollection200Response, GoodJsonldGoodReadIdReadGoodGroupNameRead, GoodJsonldGoodWrite, GoodService } from "@api/index";
import { ValidationPopupsService } from '@lib/services/validation';
import { HttpErrorResponse } from '@angular/common/http';
import { Helper } from "@lib/helpers/Helper.functions";
import { TGoodGoodWriteWithId } from "../types/good.store.types";
import { GoodEntity } from "../model/GoodEntity.model";

export function withGoodsApi() {
    return signalStoreFeature(
        withMethods((
            store: any,
            apiService: GoodService = inject(GoodService),
            defaultOverlayService: DefaultOverlayService = inject(DefaultOverlayService),
            validationPopupsService: ValidationPopupsService = inject(ValidationPopupsService),
        ) => {
            let methods = {
                loadByFilter: rxMethod<void>(
                    pipe(
                        exhaustMap(() => {
                            return apiService.apiGoodsGetCollection(...store.filter().getFilter()).pipe(
                                tapResponse({
                                    next: (good: ApiGoodsGetCollection200Response) => {
                                        good.member.forEach((it: GoodJsonldGoodReadIdReadGoodGroupNameRead) => {
                                            it.price.amount = Helper.transformFixedAmount(it.price.amount);
                                        });
                                        patchState(store, setAllEntities<GoodEntity>(good.member.map(it => new GoodEntity(it))));
                                        patchState(store, { isLoading: true });
                                    },
                                    error: console.error,
                                    finalize: () => {
                                    },
                                })
                            );
                        })
                    )
                ),
                create: rxMethod<GoodJsonldGoodWrite>(
                    pipe(
                        filter((goods: GoodJsonldGoodWrite) => !!goods),
                        exhaustMap((goods: GoodJsonldGoodWrite) => {
                            defaultOverlayService.show();
                            goods.price.amount = Helper.transformFixedAmount(goods.price.amount, true);
                            return apiService.apiGoodsPost(goods).pipe(
                                tap((newGoods: GoodEntity) => {
                                    validationPopupsService.clearErrors();
                                    newGoods.price.amount = Helper.transformFixedAmount(newGoods.price.amount);
                                    patchState(store, setEntity<GoodEntity>(new GoodEntity(newGoods)));
                                    patchState(store, { created: true });
                                }),
                                catchError(error => {
                                    console.error(error);
                                    validationPopupsService.setViolations(error?.error?.violations);
                                    return throwError(() => error);
                                }),
                                finalize(() => defaultOverlayService.hide()),
                            );
                        })
                    )
                ),
                update: rxMethod<TGoodGoodWriteWithId>(
                    pipe(
                        filter((goods: TGoodGoodWriteWithId) => !!goods),
                        exhaustMap((goods: TGoodGoodWriteWithId) => {
                            defaultOverlayService.show();
                            goods.price.amount = Helper.transformFixedAmount(goods.price.amount, true);
                            return apiService.apiGoodsIdPatch(goods.id, goods).pipe(
                                tapResponse({
                                    next: (updatedGoods: GoodEntity) => {
                                        updatedGoods.price.amount = Helper.transformFixedAmount(updatedGoods.price.amount);
                                        patchState(store, setEntity<GoodEntity>(new GoodEntity(updatedGoods)));
                                        patchState(store, { isLoading: true, updated: true });
                                    },
                                    error: (error: HttpErrorResponse) => {
                                        validationPopupsService.setViolations(error?.error?.violations);
                                    },
                                    finalize: () => {
                                        defaultOverlayService.hide();
                                    },
                                })
                            );
                        })
                    )
                ),
                delete: rxMethod<string>(
                    pipe(
                        filter((goodsId: string) => !!goodsId),
                        exhaustMap((goodsId: string) => {
                            defaultOverlayService.show();
                            return apiService.apiGoodsIdDelete(goodsId).pipe(
                                tapResponse({
                                    next: () => {
                                        patchState(store, removeEntity(goodsId));
                                        patchState(store, { isLoading: true, deleted: true });
                                    },
                                    error: (error: HttpErrorResponse) => {
                                        validationPopupsService.setViolations(error?.error?.violations);
                                    },
                                    finalize: () => {
                                        defaultOverlayService.hide();
                                    },
                                })
                            );
                        })
                    )
                ),
                getById: rxMethod<string>(
                    pipe(
                        exhaustMap((id: string) => {
                            return apiService.apiGoodsIdGet(id);
                        }),
                        tapResponse({
                            next(value: GoodJsonldGoodReadIdReadGoodGroupNameRead) {
                                Helper.processObject(value.price);
                                const goodEntity: GoodEntity = new GoodEntity(value);
                                patchState(store, setEntity(goodEntity));
                            },
                            error: console.error
                        })
                    )
                )
            };
            return methods;
        })
    );
};
