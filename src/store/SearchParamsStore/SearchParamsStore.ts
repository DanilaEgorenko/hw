import { ISearchParamsStore } from '@entities/searchParamsStore/client';
import { action, makeObservable, observable } from 'mobx';
import * as qs from 'qs';

type PrivateFields = '_searchParams';

export default class SearchParamsStore implements ISearchParamsStore {
  private _searchParams: qs.ParsedQs = {};
  private _search: string = '';

  constructor() {
    makeObservable<SearchParamsStore, PrivateFields>(this, {
      _searchParams: observable.ref,
      setSearch: action,
    });
  }

  getParam(
    key: string
  ): undefined | string | string[] | qs.ParsedQs | qs.ParsedQs[] {
    return this._searchParams[key];
  }

  setSearch(search: string) {
    search = search.startsWith('?') ? search.slice(1) : search;

    if (this._search !== search) {
      this._search = search;
      this._searchParams = qs.parse(search);
    }
  }
}
