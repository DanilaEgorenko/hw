import { useEffect, useState } from 'react';

import { Tag } from '@components/Tag/Tag';
import { Octokit } from '@octokit/core';
import parse from 'html-react-parser';
import { useNavigate, useParams } from 'react-router-dom';

import styles from '../styles/Repo.module.scss';

export const Repo: React.FC = () => {
  const { repo } = useParams();
  const [repoData, setRepoData] = useState<any>();
  const [readme, setReadme] = useState();
  useEffect(() => {
    const fetch = async () => {
      const octokit = new Octokit({
        auth: process.env.key,
      });
      const result = await octokit.request('GET /repos/ktsstudio/{repo}', {
        repo,
      });
      setRepoData(result.data);
      const readme = await octokit.request(
        'GET /repos/ktsstudio/{repo}/readme',
        {
          repo,
          headers: {
            accept: 'application/vnd.github.html+json',
          },
        }
      );
      setReadme(readme.data);
    };

    fetch();
  }, [repo]);
  const navigate = useNavigate();
  return (
    <div className={styles.repo}>
      <div className={styles.repo__flex}>
        <div className={styles.repo__flex__title}>
          <div className={styles.back} onClick={() => navigate(-1)}></div>
          <h1>{repoData?.full_name}</h1>
        </div>
        {repoData?.homepage && (
          <div className={styles.link__site}>
            <a href={repoData?.homepage}>{repoData?.homepage}</a>
          </div>
        )}
        {repoData?.description && <span>{repoData?.description}</span>}
        <div className={styles.tags}>
          {repoData?.topics.map((el: any) => (
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
};
