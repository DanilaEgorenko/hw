import { Meta } from '@entities/meta/client';
import { IRepo } from '@entities/repos/client';
import {
  GetOrganisationReposListParams,
  IReposListStore
} from '@entities/reposListStore/client';
import RootStore from '@store/RootStore';
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction
} from 'mobx';

type PrivateFields =
  | '_meta'
  | '_repos'
  | '_curPage'
  | '_hasNextPage'
  | '_searchVal'
  | '_type';

export default class ReposListStore implements IReposListStore {
  private readonly _rootStore = new RootStore();
  private _meta: Meta = Meta.initial;
  private _repos: IRepo[] = [];
  private _curPage: number = +(
    this._rootStore._searchParamsStore.searchParams.get('page') || 1
  );
  private _hasNextPage: boolean = false;
  private _searchVal: string =
    this._rootStore._searchParamsStore.searchParams.get('search') || '';
  private _type: string =
    this._rootStore._searchParamsStore.searchParams.get('type') || '';

  constructor() {
    makeObservable<ReposListStore, PrivateFields>(this, {
      _meta: observable,
      _repos: observable, // нельзя сменить на computed
      _curPage: observable,
      _hasNextPage: observable,
      _searchVal: observable,
      _type: observable,
      meta: computed,
      getOrganizationReposList: action.bound,
      hasNextReposList: action.bound,
      setSearchVal: action.bound,
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

  get hasNextPage(): boolean {
    return this._hasNextPage;
  }

  get searchVal(): string {
    return this._searchVal;
  }

  get type(): string {
    return this._type;
  }

  async getOrganizationReposList(
    params: GetOrganisationReposListParams
  ): Promise<void> {
    this._meta = Meta.loading;

    const response = await this._rootStore._apiStore.request({
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
            const paramSearch =
              this._rootStore._searchParamsStore.searchParams.get('search');
            if (paramSearch) return name.includes(paramSearch);
            return true;
          })
          .filter((el: IRepo) => {
            const paramSearch =
              this._rootStore._searchParamsStore.searchParams
                .get('type')
                ?.split(';') || [];
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

    const response = await this._rootStore._apiStore.request({
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

  setSearchVal(val: string): void {
    this._searchVal = val;
  }

  destroy(): void {}
}
