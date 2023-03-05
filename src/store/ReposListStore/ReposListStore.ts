import { Meta } from '@entities/meta/client';
import { IRepo } from '@entities/repos/client';
import {
  GetOrganisationReposListParams,
  IReposListStore
} from '@entities/reposListStore/client';
import { BASE_URL } from '@entities/store/client';
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction
} from 'mobx';

import ApiStore from '../ApiStore/ApiStore';

type PrivateFields = '_meta' | '_repos' | '_curPage' | '_hasNextPage';

export default class ReposListStore implements IReposListStore {
  private readonly _apiStore = new ApiStore(BASE_URL);
  private _meta: Meta = Meta.initial;
  private _repos: IRepo[] = [];
  private _curPage: number = 1;
  private _hasNextPage: boolean = false;

  constructor() {
    makeObservable<ReposListStore, PrivateFields>(this, {
      _meta: observable,
      _repos: observable, // нельзя сменить на computed
      _curPage: observable,
      _hasNextPage: observable,
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

  get curPage(): number {
    return this._curPage;
  }

  set curPage(val) {
    this._curPage = val;
  }

  get hasNextPage(): boolean {
    return this._hasNextPage;
  }

  async getOrganizationReposList(
    params: GetOrganisationReposListParams
  ): Promise<void> {
    this._meta = Meta.loading;

    const response = await this._apiStore.request({
      endpoint: `/orgs/${params.organizationName}/repos?page=${this.curPage}`,
    });

    runInAction(() => {
      if (this._meta === Meta.loading) {
        return;
      }
      if (response.status === 200) {
        this._meta = Meta.success;
        this._repos = response.data
          .filter(({ name }: { name: string }) => {
            const paramSearch = params.searchParams.get('search');
            if (paramSearch) return name.includes(paramSearch);
            return true;
          })
          .filter((el: IRepo) => {
            const paramSearch =
              params.searchParams.get('type')?.split(';') || [];
            if (paramSearch.length && paramSearch[0]) {
              for (let p of paramSearch) {
                if (
                  (!el.private && p === 'public') ||
                  (el.private && p === 'private') ||
                  (el.archived && p === 'archived') ||
                  (!el.archived && p === 'non-archived') ||
                  (el.allow_forking && p === 'allow-forking') ||
                  (!el.allow_forking && p === 'non-allow-forking')
                ) {
                  continue;
                } else {
                  return false;
                }
              }
            }
            return true;
          });
        return;
      }

      this._meta = Meta.error;
    });

    this._meta = Meta.error;
  }

  async hasNextReposList(
    params: GetOrganisationReposListParams
  ): Promise<void> {
    this._meta = Meta.loading;

    const response = await this._apiStore.request({
      endpoint: `/orgs/${params.organizationName}/repos?page=${
        this.curPage + 1
      }`,
    });

    runInAction(() => {
      if (this._meta === Meta.loading) {
        return;
      }
      if (response.status === 200) {
        this._meta = Meta.success;
        this._hasNextPage = !!response.data.length;
        return;
      }

      this._meta = Meta.error;
    });

    this._meta = Meta.error;
  }

  destroy(): void {}
}
