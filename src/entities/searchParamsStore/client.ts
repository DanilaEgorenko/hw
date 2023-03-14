export interface ISearchParamsStore {
  getParam(
    key: string
  ): undefined | string | string[] | qs.ParsedQs | qs.ParsedQs[];
  setSearch(search: string): void;
}

export interface ISetSearchParams {
  target: string;
  value: string;
}
