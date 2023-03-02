import { useEffect, useState } from 'react';

import { Card } from '@components/Card/Card';
import { Pagination } from '@components/Pagination/Pagination';
import { IRepo, IRepoList } from '@entities/repos/client';
import { toDate } from '@utils/toDate';
import axios from 'axios';
import { Link } from 'react-router-dom';

import styles from '../ReposList.module.scss';

export const RepoList: React.FC<IRepoList> = ({ searchParams }) => {
  const [repos, setRepos] = useState<IRepo[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `https://api.github.com/orgs/ktsstudio/repos?page=${pageCount}`
      );
      setRepos(
        res.data
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
      const nextPage = await axios.get(
        `https://api.github.com/orgs/ktsstudio/repos?page=${pageCount + 1}`
      );
      setHasNextPage(!!nextPage.data.length);
    };

    fetch();
  }, [pageCount, searchParams]);
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
        pageCount={pageCount}
        setPageCount={setPageCount}
        hasNextPage={hasNextPage}
      />
    </>
  );
};
