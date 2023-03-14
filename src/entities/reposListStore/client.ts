import { Option } from '@entities/multiDropdown/client';

export interface IReposListStore {
  hasNextPage: boolean;
  curPage: number;
  getOrganizationReposList(
    params: GetOrganisationReposListParams
  ): Promise<void>;
  hasNextReposList(params: GetOrganisationReposListParams): Promise<void>;
  setSearchVal(val: string): void;
  setChecked(val: Option[]): void;
}

export interface GetOrganisationReposListParams {
  organizationName: string;
}
