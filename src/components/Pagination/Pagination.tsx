import React, { useCallback, useEffect } from 'react';

import { Button } from '@components/Button/Button';
import { IPagination } from '@entities/pagination/client';
import { observer } from 'mobx-react-lite';
import { useSearchParams } from 'react-router-dom';

import styles from '../Pagination/Pagination.module.scss';

export const Pagination: React.FC<IPagination> = observer(({ reposStore }) => {
  useEffect(() => {
    reposStore.hasNextReposList({
      organizationName: 'ktsstudio',
    });
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const toLastPage = useCallback(
    (val: number) => {
      searchParams.set('page', `${reposStore.curPage + val}`);
      setSearchParams(searchParams);
      reposStore._rootStore?._searchParamsStore.setParam(
        'page',
        `${reposStore.curPage + val}`
      );
      reposStore.setCurPage(reposStore.curPage + val);
      reposStore.getOrganizationReposList({
        organizationName: 'ktsstudio',
      });
    },
    [reposStore, searchParams, setSearchParams]
  );
  if (reposStore.curPage <= 1 && !reposStore.hasNextPage) return null;
  return (
    <div className={styles.pagination}>
      {reposStore.curPage > 1 && (
        <Button className="next" onClick={() => toLastPage(-1)}>
          Предыдущая
        </Button>
      )}
      <span className={styles['page-count']}>{reposStore.curPage}</span>
      {reposStore.hasNextPage && (
        <Button className="next" onClick={() => toLastPage(+1)}>
          Следующая
        </Button>
      )}
    </div>
  );
});
