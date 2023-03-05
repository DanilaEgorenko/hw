export interface IReposListStore {
  getOrganizationReposList(
    params: GetOrganisationReposListParams
  ): Promise<void>;
}

export interface GetOrganisationReposListParams {
  organizationName: string;
}
