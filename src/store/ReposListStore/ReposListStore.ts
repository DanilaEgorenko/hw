import { Meta } from '@entities/meta/client';
import { Option } from '@entities/multiDropdown/client';
import { IRepo } from '@entities/repos/client';
import { IType } from '@entities/reposList/client';
import {
  GetOrganisationReposListParams,
  IReposListStore
} from '@entities/reposListStore/client';
import { IRootStore } from '@entities/rootStore/client';
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
  | '_type'
  | '_checked';

export default class ReposListStore implements IReposListStore {
  types: IType[] = [
    { checked: false, key: 'private', value: 'Private' },
    { checked: false, key: 'public', value: 'Public' },
    { checked: false, key: 'archived', value: 'Archived' },
    { checked: false, key: 'non-archived', value: 'Non archived' },
    { checked: false, key: 'allow-forking', value: 'Allow forking' },
    {
      checked: false,
      key: 'non-allow-forking',
      value: 'Non allow forking',
    },
  ];

  _rootStore: IRootStore | null = null;

  private _meta: Meta = Meta.initial;
  private _repos: IRepo[] = [];
  private _curPage: number = 1;
  private _hasNextPage: boolean = false;
  private _searchVal: string = '';
  private _type: string = '';
  private _checked: Option[] = this.types.filter((el: IType) => el.checked);

  constructor(_rootStore: RootStore) {
    this._rootStore = _rootStore;
    this._searchVal =
      this?._rootStore?._searchParamsStore.getParam('search') || '';
    this._type = this?._rootStore?._searchParamsStore.getParam('type') || '';
    this._curPage = +(
      this?._rootStore?._searchParamsStore.getParam('page') || 1
    );
    makeObservable<ReposListStore, PrivateFields>(this, {
      _meta: observable,
      _repos: observable,
      _curPage: observable,
      _hasNextPage: observable,
      _searchVal: observable,
      _type: observable,
      _checked: observable,
      meta: computed,
      repos: computed,
      curPage: computed,
      hasNextPage: computed,
      searchVal: computed,
      type: computed,
      checked: computed,
      setCurPage: observable,
      setType: observable,
      getOrganizationReposList: action.bound,
      hasNextReposList: action.bound,
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

  setCurPage(val: number): void {
    this._curPage = val;
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

  setType(val: string): void {
    this._type = val;
  }

  get checked(): Option[] {
    return this._checked;
  }

  async getOrganizationReposList(
    params: GetOrganisationReposListParams
  ): Promise<void> {
    this._meta = Meta.loading;

    const response = await this?._rootStore?._apiStore.request({
      endpoint: `/orgs/${params.organizationName}/repos?page=${this.curPage}&sort=updated`,
    });

    runInAction(() => {
      if (response?.status === 200) {
        this._meta = Meta.success;
        this._repos = response.data.filter((el: IRepo) => {
          const paramType = this.type.split(';') || [];
          if (paramType.length && paramType[0]) {
            for (let p of paramType) {
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
          const paramSearch =
            this?._rootStore?._searchParamsStore.getParam('search');
          if (paramSearch) return el.name.includes(paramSearch.toString());
          return true;
        });
        return;
      }

      this._meta = Meta.error;
    });
  }

  async hasNextReposList(
    params: GetOrganisationReposListParams
  ): Promise<void> {
    this._meta = Meta.loading;

    const response = await this?._rootStore?._apiStore.request({
      endpoint: `/orgs/${params.organizationName}/repos?page=${
        this.curPage + 1
      }`,
    });

    runInAction(() => {
      if (response?.status === 200) {
        this._meta = Meta.success;
        this._hasNextPage = !!response.data.length;
        return;
      }

      this._meta = Meta.error;
    });
  }

  setSearchVal(val: string): void {
    this._searchVal = val;
  }

  destroy(): void {}
}
