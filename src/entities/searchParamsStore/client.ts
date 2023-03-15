export interface ISearchParamsStore {
  getParam(key: string): string | null;
  setParam(key: string, value: string): void;
}

export interface ISetSearchParams {
  target: string;
  value: string;
}
