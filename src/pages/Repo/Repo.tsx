import { useEffect } from 'react';

import { Tag } from '@components/Tag/Tag';
import RepoStore from '@store/RepoStore';
import parse from 'html-react-parser';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './Repo.module.scss';

export const Repo: React.FC = observer(() => {
  const { repo } = useParams();
  const repoStore = new RepoStore();

  useEffect(() => {
    repoStore.getOrganizationRepoData({
      organizationName: 'ktsstudio',
      repo,
    });
    repoStore.getOrganizationRepoReadme({
      organizationName: 'ktsstudio',
      repo,
    });
  }, [repo]);
  const navigate = useNavigate();
  if (!repoStore.repo) {
    // не обновляется значение после загрузки
    return null;
  }
  return (
    <div className={styles.repo}>
      <div className={styles.repo__flex}>
        <div className={styles.repo__flex__title}>
          <div className={styles.back} onClick={() => navigate(-1)}></div>
          <h1>{repoStore.repo.full_name}</h1>
        </div>
        {repoStore.repo?.homepage && (
          <div className={styles.link__site}>
            <a href={repoStore.repo?.homepage}>{repoStore.repo?.homepage}</a>
          </div>
        )}
        {repoStore.repo?.description && (
          <span>{repoStore.repo?.description}</span>
        )}
        <div className={styles.tags}>
          {repoStore.repo?.topics?.map((el: string) => (
            <Tag title={el} key={el} />
          ))}
        </div>
        <div className={styles.repo__content}>
          <span
            className={styles.repo__stars}
          >{`${repoStore.repo?.stargazers_count} stars`}</span>
          <span
            className={styles.repo__watching}
          >{`${repoStore.repo?.watchers} watching`}</span>
          <span
            className={styles.repo__fork}
          >{`${repoStore.repo?.forks} fork`}</span>
        </div>
      </div>
      {repoStore.readme && (
        <div className={styles.repo__readme}>
          <span className={styles.repo__readme__title}>README.md</span>
          {parse(repoStore.readme)}
        </div>
      )}
    </div>
  );
});
