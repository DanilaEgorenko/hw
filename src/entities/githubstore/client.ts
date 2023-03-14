import { IRootStore } from '@entities/rootStore/client';

export interface IGitHubStore {
  _rootStore: IRootStore | null;
  getOrganizationRepoData(params: GetOrganisationRepoDataParams): Promise<void>;
}

export interface GetOrganisationRepoDataParams {
  organizationName: string;
  repo: string | undefined;
}
