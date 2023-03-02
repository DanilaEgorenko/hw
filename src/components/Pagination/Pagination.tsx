import { Button } from '@components/Button/Button';
import { IPagination } from '@entities/pagination/client';

import styles from '../Pagination/Pagination.module.scss';

export const Pagination: React.FC<IPagination> = ({
  pageCount,
  setPageCount,
  hasNextPage,
}) => {
  if (pageCount <= 1 && !hasNextPage) return null;
  return (
    <div className={styles.pagination}>
      {pageCount > 1 && (
        <Button
          className="next"
          onClick={() => {
            setPageCount((p) => p - 1);
          }}
        >
          Предыдущая
        </Button>
      )}
      <span className={styles['page-count']}>{pageCount}</span>
      {hasNextPage && (
        <Button
          className="next"
          onClick={() => {
            setPageCount((p) => p + 1);
          }}
        >
          Следующая
        </Button>
      )}
    </div>
  );
};
