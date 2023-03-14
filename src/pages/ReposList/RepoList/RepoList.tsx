import React, { useContext, useEffect } from 'react';

import { Card } from '@components/Card/Card';
import { Pagination } from '@components/Pagination/Pagination';
import { IRepo } from '@entities/repos/client';
import { useLocalStore } from '@hooks/useLocalStore';
import ReposListStore from '@store/ReposListStore';
import { toDate } from '@utils/toDate';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { ContextRootStore } from '../../../index';
import styles from '../ReposList.module.scss';

export const RepoList: React.FC = observer(() => {
  const root = useContext(ContextRootStore);
  const reposList = useLocalStore(() => new ReposListStore(root));
  useEffect(() => {
    reposList.getOrganizationReposList({
      organizationName: 'ktsstudio',
    });
  }, [reposList]);

  return (
    <>
      <div className={styles.repos}>
        {reposList.repos.map((repo: IRepo) => {
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

      <Pagination reposStore={reposList} />
    </>
  );
});
