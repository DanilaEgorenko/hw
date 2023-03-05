import { useEffect, useState } from 'react';

import { Tag } from '@components/Tag/Tag';
import { IRepo } from '@entities/repos/client';
import RepoStore from '@store/RepoStore';
import parse from 'html-react-parser';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './Repo.module.scss';

export const Repo: React.FC = observer(() => {
  const { repo } = useParams();
  const [repoData, setRepoData] = useState<IRepo | null>();
  const [readme, setReadme] = useState<string>('');
  const repoStore = new RepoStore();

  useEffect(() => {
    repoStore
      .getOrganizationRepoData({
        organizationName: 'ktsstudio',
        repo,
      })
      .then(() => {
        setRepoData(repoStore.repo);
      });
    repoStore
      .getOrganizationRepoReadme({
        organizationName: 'ktsstudio',
        repo,
      })
      .then(() => {
        setReadme(repoStore.readme);
      });
  }, [repo]);
  const navigate = useNavigate();
  if (!repoData) {
    return null;
  }
  return (
    <div className={styles.repo}>
      <div className={styles.repo__flex}>
        <div className={styles.repo__flex__title}>
          <div className={styles.back} onClick={() => navigate(-1)}></div>
          <h1>{repoData.full_name}</h1>
        </div>
        {repoData?.homepage && (
          <div className={styles.link__site}>
            <a href={repoData?.homepage}>{repoData?.homepage}</a>
          </div>
        )}
        {repoData?.description && <span>{repoData?.description}</span>}
        <div className={styles.tags}>
          {repoData?.topics?.map((el: string) => (
            <Tag title={el} key={el} />
          ))}
        </div>
        <div className={styles.repo__content}>
          <span
            className={styles.repo__stars}
          >{`${repoData?.stargazers_count} stars`}</span>
          <span
            className={styles.repo__watching}
          >{`${repoData?.watchers} watching`}</span>
          <span className={styles.repo__fork}>{`${repoData?.forks} fork`}</span>
        </div>
      </div>
      {readme && (
        <div className={styles.repo__readme}>
          <span className={styles.repo__readme__title}>README.md</span>
          {parse(readme)}
        </div>
      )}
    </div>
  );
});
