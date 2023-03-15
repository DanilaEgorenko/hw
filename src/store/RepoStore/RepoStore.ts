import {
  GetOrganisationRepoDataParams,
  IGitHubStore
} from '@entities/githubstore/client';
import { Meta } from '@entities/meta/client';
import { IRepo } from '@entities/repos/client';
import { IRootStore } from '@entities/rootStore/client';
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
  private _meta: Meta = Meta.initial;
  private _repo: IRepo | null = null;
  private _readme: string = '';
  _rootStore: IRootStore | null = null;

  constructor(_rootStore: RootStore) {
    this._rootStore = _rootStore;
    makeObservable<RepoStore, PrivateFields>(this, {
      _meta: observable,
      _repo: observable,
      _readme: observable,
      meta: computed,
      repo: computed,
      readme: computed,
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

    const response = await this?._rootStore?._apiStore.request({
      endpoint: `/repos/${params.organizationName}/${params.repo}`,
    });

    runInAction(() => {
      if (response?.status === 200) {
        this._meta = Meta.success;
        this._repo = response.data;
        return;
      }

      this._meta = Meta.error;
    });
  }

  async getOrganizationRepoReadme(
    params: GetOrganisationRepoDataParams
  ): Promise<void> {
    this._meta = Meta.loading;

    try {
      const response = await this?._rootStore?._apiStore.request({
        endpoint: `/repos/${params.organizationName}/${params.repo}/readme`,
      });

      runInAction(() => {
        if (response?.status === 200) {
          this._meta = Meta.success;
          this._readme = response.data;
          return;
        }

        this._meta = Meta.error;
      });
    } catch (e) {
      this._meta = Meta.success;
    }
  }

  destroy(): void {}
}
