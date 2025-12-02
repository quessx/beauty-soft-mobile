import { Helper } from '@lib/helpers/Helper.functions';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { withEntities } from "@ngrx/signals/entities";
import { withGoodsApi } from './api/good-api.feature';
import { GoodFilter } from './api/good.store.filter.class';
import { GoodEntity } from './model/GoodEntity.model';

type TGoodState = {
    goods: GoodEntity[];
    isLoading: boolean,
    filter: GoodFilter,
    selectedId: string,
    deleted: boolean,
    updated: boolean,
    created: boolean;
};

const initialState: TGoodState = {
    goods: [],
    isLoading: false,
    filter: new GoodFilter(),
    selectedId: '',
    deleted: false,
    updated: false,
    created: false
};

export const GoodStore = signalStore(
    { providedIn: "root", protectedState: false },
    withState(initialState),
    withEntities<GoodEntity>(),
    withGoodsApi(),
    withMethods((store) => ({
        getByGroupId: (groupId: string): GoodEntity[] => {
            return store.entities().filter(el => !!el.goodGroup?.['@id'] && typeof el.goodGroup['@id'] === "string" && (Helper.getUIDFromAtId(el.goodGroup['@id']) === groupId));
        },
    }))
);
