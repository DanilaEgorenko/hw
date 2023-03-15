import { IRootStore } from '../rootStore/client';

export interface IReposListStore {
  _rootStore: IRootStore | null;
  hasNextPage: boolean;
  curPage: number;
  setCurPage(val: number): void;
  type: string;
  setType(val: string): void;
  getOrganizationReposList(
    params: GetOrganisationReposListParams
  ): Promise<void>;
  hasNextReposList(params: GetOrganisationReposListParams): Promise<void>;
  setSearchVal(val: string): void;
}

export interface GetOrganisationReposListParams {
  organizationName: string;
}
