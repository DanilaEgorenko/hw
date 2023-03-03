import { Button } from '@components/Button/Button';
import { IPagination } from '@entities/pagination/client';
import { useSearchParams } from 'react-router-dom';

import styles from '../Pagination/Pagination.module.scss';

export const Pagination: React.FC<IPagination> = ({
  curPage,
  setCurPage,
  hasNextPage,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  if (curPage <= 1 && !hasNextPage) return null;
  return (
    <div className={styles.pagination}>
      {curPage > 1 && (
        <Button
          className="next"
          onClick={() => {
            setCurPage((p) => p - 1);
            searchParams.set('page', `${curPage - 1}`);
            setSearchParams(searchParams);
          }}
        >
          Предыдущая
        </Button>
      )}
      <span className={styles['page-count']}>{curPage}</span>
      {hasNextPage && (
        <Button
          className="next"
          onClick={() => {
            setCurPage((p) => p + 1);
            searchParams.set('page', `${curPage + 1}`);
            setSearchParams(searchParams);
          }}
        >
          Следующая
        </Button>
      )}
    </div>
  );
};
