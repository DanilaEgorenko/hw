import { ISearchParamsStore } from '@entities/searchParamsStore/client';
import { action, makeObservable, observable } from 'mobx';

type PrivateFields = '_searchParams';

export default class SearchParamsStore implements ISearchParamsStore {
  private _searchParams = new URL(window.location.href);

  constructor() {
    makeObservable<SearchParamsStore, PrivateFields>(this, {
      _searchParams: observable.ref,
      setParam: action.bound,
    });
  }

  getParam(key: string): string | null {
    return this._searchParams.searchParams.get(key);
  }

  setParam(key: string, value: string): void {
    this._searchParams.searchParams.set(key, value);
  }
}
