import { Option } from '@components/MultiDropdown/MultiDropdown';

export interface IReposListStore {
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
