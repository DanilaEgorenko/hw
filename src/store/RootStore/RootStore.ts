import { IRootStore } from '@entities/rootStore/client';
import { ISearchParamsStore } from '@entities/searchParamsStore/client';
import { BASE_URL } from '@entities/store/client';
import ApiStore from '@store/ApiStore';
import SearchParamsStore from '@store/SearchParamsStore';

export default class RootStore implements IRootStore {
  readonly _apiStore = new ApiStore(BASE_URL);
  readonly _searchParamsStore: ISearchParamsStore = new SearchParamsStore();

  destroy(): void {}
}
