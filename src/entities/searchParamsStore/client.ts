export interface ISearchParamsStore {
  searchParams: any;
  setSearchParams: (val: ISetSearchParams) => void;
}

export interface ISetSearchParams {
  target: string;
  value: string;
}
