import { Meta } from '@entities/meta/client';
import { IRootStore } from '@entities/rootStore/client';
import { ISearchParamsStore } from '@entities/searchParamsStore/client';
import { BASE_URL } from '@entities/store/client';
import ApiStore from '@store/ApiStore';
import SearchParamsStore from '@store/SearchParamsStore';
import { makeObservable, observable } from 'mobx';

type PrivateFields = '_meta';

export default class RootStore implements IRootStore {
  readonly _apiStore = new ApiStore(BASE_URL);
  readonly _searchParamsStore: ISearchParamsStore = new SearchParamsStore();
  private _meta: Meta = Meta.initial;

  constructor() {
    makeObservable<RootStore, PrivateFields>(this, {
      _meta: observable,
    });
  }

  destroy(): void {}
}
