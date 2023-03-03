import { IRepo } from '@entities/repos/client';
import {
  GetOrganisationReposListParams,
  // eslint-disable-next-line prettier/prettier
  IReposListStore
} from '@entities/reposListStore/client';
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

type PrivateFields = '_meta' | '_repos';

export default class ReposListStore implements IReposListStore {
  private readonly _apiStore = new ApiStore(BASE_URL);
  private _meta: Meta = Meta.initial;
  private _repos: IRepo[] = [];

  constructor() {
    makeObservable<ReposListStore, PrivateFields>(this, {
      _meta: observable,
      _repos: observable.ref,
      meta: computed,
      getOrganizationReposList: action,
    });
  }

  get meta(): Meta {
    return this._meta;
  }

  get repos(): IRepo[] {
    return this._repos;
  }

  async getOrganizationReposList(
    params: GetOrganisationReposListParams
  ): Promise<void> {
    this._meta = Meta.loading;
    this._repos = [];

    const response = await this._apiStore.request({
      endpoint: `/orgs/${params.organizationName}/repos?page=${params.curPage}`,
    });

    runInAction(() => {
      if (response.status === 200) {
        this._meta = Meta.success;
        this._repos = response.data;
        return;
      }

      this._meta = Meta.error;
    });

    this._meta = Meta.error;
  }

  destroy(): void {}
}
