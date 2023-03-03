export interface IPagination {
  curPage: number;
  setCurPage: React.Dispatch<React.SetStateAction<number>>;
  hasNextPage: boolean;
}
