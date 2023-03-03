import {
  GetOrganisationRepoDataParams,
  // eslint-disable-next-line prettier/prettier
  IGitHubStore
} from '@entities/githubstore/client';
import { IRepo } from '@entities/repos/client';
import { Meta } from '@utils/meta';
import {
  action,
  computed,
  makeObservable,
  observable,
  // eslint-disable-next-line prettier/prettier
  runInAction
} from 'mobx';

import ApiStore from '../ApiStore/ApiStore';

const BASE_URL = 'https://api.github.com';

type PrivateFields = '_meta' | '_repo' | '_readme';

export default class RepoStore implements IGitHubStore {
  private readonly _apiStore = new ApiStore(BASE_URL);
  private _meta: Meta = Meta.initial;
  private _repo: IRepo = {} as IRepo;
  private _readme: string = '';

  constructor() {
    makeObservable<RepoStore, PrivateFields>(this, {
      _meta: observable,
      _repo: observable.ref,
      _readme: observable.ref,
      meta: computed,
      getOrganizationRepoData: action,
    });
  }

  get meta(): Meta {
    return this._meta;
  }

  get repo(): IRepo {
    return this._repo;
  }

  get readme(): string {
    return this._readme;
  }

  async getOrganizationRepoData(
    params: GetOrganisationRepoDataParams
  ): Promise<void> {
    this._meta = Meta.loading;
    this._repo = {} as IRepo;

    const response = await this._apiStore.request({
      endpoint: `/repos/${params.organizationName}/${params.repo}`,
    });

    runInAction(() => {
      if (response.status === 200) {
        this._meta = Meta.success;
        this._repo = response.data;
        return;
      }

      this._meta = Meta.error;
    });

    this._meta = Meta.error;
  }

  async getOrganizationRepoReadme(
    params: GetOrganisationRepoDataParams
  ): Promise<void> {
    this._meta = Meta.loading;
    this._readme = '';

    const response = await this._apiStore.request({
      headers: {
        accept: 'application/vnd.github.html+json',
      },
      endpoint: `/repos/${params.organizationName}/${params.repo}/readme`,
    });

    runInAction(() => {
      if (response.status === 200) {
        this._meta = Meta.success;
        this._readme = response.data;
        return;
      }

      this._meta = Meta.error;
    });

    this._meta = Meta.error;
  }

  destroy(): void {}
}
