import { useEffect, useState } from 'react';

import { Button } from '@components/Button/Button';
import { IPagination } from '@entities/pagination/client';
import { observer } from 'mobx-react-lite';
import { useSearchParams } from 'react-router-dom';

import styles from '../Pagination/Pagination.module.scss';

export const Pagination: React.FC<IPagination> = observer(({ reposStore }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasNextPage, setHasNextPage] = useState(false);
  const [curPage, setCurPage] = useState<number>(
    +(searchParams.get('page') || 1)
  );
  useEffect(() => {
    reposStore
      .hasNextReposList({
        organizationName: 'ktsstudio',
        searchParams,
      })
      .then(() => {
        setHasNextPage(reposStore.hasNextPage);
      });
  });
  if (curPage <= 1 && !hasNextPage) return null;
  return (
    <div className={styles.pagination}>
      {curPage > 1 && (
        <Button
          className="next"
          onClick={() => {
            setCurPage(curPage - 1);
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
            setCurPage(curPage + 1);
            searchParams.set('page', `${curPage + 1}`);
            setSearchParams(searchParams);
          }}
        >
          Следующая
        </Button>
      )}
    </div>
  );
});
