import { useEffect } from 'react';

import { Card } from '@components/Card/Card';
import { Pagination } from '@components/Pagination/Pagination';
import { IRepo, IRepoList } from '@entities/repos/client';
import ReposListStore from '@store/ReposListStore';
import { toDate } from '@utils/toDate';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import styles from '../ReposList.module.scss';

export const RepoList: React.FC<IRepoList> = observer(() => {
  const reposStore = useLocalObservable(() => new ReposListStore());
  useEffect(() => {
    reposStore.getOrganizationReposList({
      organizationName: 'ktsstudio',
    });
  }, [reposStore]);

  return (
    <>
      <div className={styles.repos}>
        {reposStore.repos.map((repo: IRepo) => {
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

      <Pagination reposStore={reposStore} />
    </>
  );
});
