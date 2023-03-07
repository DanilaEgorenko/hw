import { Meta } from '@entities/meta/client';
import {
  ISearchParamsStore,
  ISetSearchParams
} from '@entities/searchParamsStore/client';
import { BASE_URL } from '@entities/store/client';
import { action, makeObservable, observable } from 'mobx';

import ApiStore from '../ApiStore/ApiStore';

type PrivateFields = '_meta' | '_searchParams';

export default class SearchParamsStore implements ISearchParamsStore {
  private readonly _apiStore = new ApiStore(BASE_URL);
  private _meta: Meta = Meta.initial;
  private readonly _searchParams = new URLSearchParams(window.location.href);

  constructor() {
    makeObservable<SearchParamsStore, PrivateFields>(this, {
      _meta: observable,
      _searchParams: observable,
      setSearchParams: action.bound,
    });
  }

  get searchParams(): URLSearchParams {
    return this._searchParams;
  }

  setSearchParams({ target, value }: ISetSearchParams): void {
    this.searchParams.set(target, value);
  }

  destroy(): void {}
}
