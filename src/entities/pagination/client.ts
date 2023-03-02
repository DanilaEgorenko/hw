export interface IPagination {
  pageCount: number;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
  hasNextPage: boolean;
}
