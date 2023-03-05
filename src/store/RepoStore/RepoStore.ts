import {
  GetOrganisationRepoDataParams,
  IGitHubStore
} from '@entities/githubstore/client';
import { Meta } from '@entities/meta/client';
import { IRepo } from '@entities/repos/client';
import RootStore from '@store/RootStore';
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction
} from 'mobx';

type PrivateFields = '_meta' | '_repo' | '_readme';

export default class RepoStore implements IGitHubStore {
  private readonly _rootStore = new RootStore();
  private _meta: Meta = Meta.initial;
  private _repo: IRepo | null = null;
  private _readme: string = '';

  constructor() {
    makeObservable<RepoStore, PrivateFields>(this, {
      _meta: observable,
      _repo: observable, // нельзя сменить на computed
      _readme: observable, // нельзя сменить на computed
      meta: computed,
      getOrganizationRepoData: action.bound,
      getOrganizationRepoReadme: action.bound,
    });
  }

  get meta(): Meta {
    return this._meta;
  }

  get repo(): IRepo | null {
    return this._repo;
  }

  get readme(): string {
    return this._readme;
  }

  async getOrganizationRepoData(
    params: GetOrganisationRepoDataParams
  ): Promise<void> {
    this._meta = Meta.loading;

    const response = await this._rootStore._apiStore.request({
      endpoint: `/repos/${params.organizationName}/${params.repo}`,
    });

    runInAction(() => {
      if (this._meta === Meta.loading) {
        return;
      }
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

    const response = await this._rootStore._apiStore.request({
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
