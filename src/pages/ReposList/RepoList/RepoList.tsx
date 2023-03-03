import { useEffect, useState } from 'react';

import { Card } from '@components/Card/Card';
import { Pagination } from '@components/Pagination/Pagination';
import { IRepo, IRepoList } from '@entities/repos/client';
import { toDate } from '@utils/toDate';
import { Link } from 'react-router-dom';

import ReposListStore from '../../../../src/store/ReposListStore';
import styles from '../ReposList.module.scss';

export const RepoList: React.FC<IRepoList> = ({ searchParams }) => {
  const [repos, setRepos] = useState<IRepo[]>([]);
  const [curPage, setCurPage] = useState<number>(
    +(searchParams.get('page') || 1)
  );
  const [hasNextPage, setHasNextPage] = useState(false);
  const reposStore = new ReposListStore();
  useEffect(() => {
    reposStore
      .getOrganizationReposList({
        organizationName: 'ktsstudio',
        curPage,
      })
      .then(() => {
        setRepos(
          reposStore.repos
            .filter(({ name }: { name: string }) => {
              const paramSearch = searchParams.get('search');
              if (paramSearch) return name.includes(paramSearch);
              return true;
            })
            .filter((el: IRepo) => {
              const paramSearch = searchParams.get('type')?.split(';') || [];
              if (paramSearch.length && paramSearch[0]) {
                for (let p of paramSearch) {
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
              return true;
            })
        );
      });
    reposStore
      .getOrganizationReposList({
        organizationName: 'ktsstudio',
        curPage: curPage + 1,
      })
      .then(() => {
        setHasNextPage(!!reposStore.repos.length);
      });
  }, [curPage, searchParams]);
  return (
    <>
      <div className={styles.repos}>
        {repos.map((repo: IRepo) => {
          return (
            <Link
              to={`/repo/${repo.name}`}
              className={styles.card__link}
              key={repo.id}
            >
              <Card
                onClick={() => {}}
                image={repo.owner.avatar_url}
                title={repo.name}
                subtitle={repo.owner.login}
                content={
                  <>
                    <div>
                      <span className={styles.star}>
                        {repo.stargazers_count}
                      </span>
                      <span>{'Updated ' + toDate(repo.updated_at + '')}</span>
                    </div>
                  </>
                }
              />
            </Link>
          );
        })}
      </div>
      <Pagination
        curPage={curPage}
        setCurPage={setCurPage}
        hasNextPage={hasNextPage}
      />
    </>
  );
};
