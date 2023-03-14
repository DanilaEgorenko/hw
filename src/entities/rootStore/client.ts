import { IApistore } from '@entities/apiStore/client';
import { ISearchParamsStore } from '@entities/searchParamsStore/client';

export interface IRootStore {
  _apiStore: IApistore;
  _searchParamsStore: ISearchParamsStore;
}
