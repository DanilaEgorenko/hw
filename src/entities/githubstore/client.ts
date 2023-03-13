export interface IGitHubStore {
  getOrganizationRepoData(params: GetOrganisationRepoDataParams): Promise<void>;
}

export interface GetOrganisationRepoDataParams {
  organizationName: string;
  repo: string | undefined;
}
