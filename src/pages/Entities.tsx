import { useEffect, useState } from 'react';

import { Button } from '@components/Button/Button';
import { Card } from '@components/Card/Card';
import { Input } from '@components/Input/Input';
import { MultiDropdown } from '@components/MultiDropdown/MultiDropdown';
import { Octokit } from '@octokit/core';
import { toDate } from '@utils/toDate';
import { Link, useSearchParams } from 'react-router-dom';

import styles from '../styles/Entities.module.scss';

export const Entities: React.FC = () => {
  const [repos, setRepos] = useState<any>([]);
  useEffect(() => {
    const fetch = async () => {
      const octokit = new Octokit({
        auth: process.env.key,
      });
      const result = await octokit.request('GET /orgs/ktsstudio/repos');
      setRepos(result.data);
    };

    fetch();
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const types = [
    { checked: false, key: 'private', value: 'Private' },
    { checked: false, key: 'public', value: 'Public' },
    { checked: false, key: 'archived', value: 'Archived' },
    { checked: false, key: 'non-archived', value: 'Non archived' },
    { checked: false, key: 'allow-forking', value: 'Allow forking' },
    {
      checked: false,
      key: 'non-allow-forking',
      value: 'Non allow forking',
    },
  ];
  type.split(';').map((type: string) => {
    types.map((el: any) => {
      if (el.key === type) el.checked = true;
    });
  });
  const [checked, setChecked] = useState<any>(
    types.filter((el: any) => el.checked)
  );
  return (
    <div className={styles.entities}>
      <div className={styles.entities__flex}>
        <Input
          value={searchVal}
          onChange={(value) => setSearchVal(value)}
          placeholder="Enter organization name"
        />
        <Button
          className="button__search"
          onClick={() => {
            searchParams.set('search', searchVal);
            setSearchParams(searchParams);
          }}
        />
      </div>
      <div className={styles.entities__flex}>
        <h1>Repositories</h1>
        <MultiDropdown
          options={types}
          value={checked}
          onChange={(val) => {
            searchParams.set('type', val.map((el) => el.key).join(';'));
            setSearchParams(searchParams);
            setChecked(val);
          }}
          pluralizeOptions={(value) =>
            value.length ? value.map((el) => el.value).join(', ') : 'Type'
          }
          className="select"
        />
      </div>
      <div className={styles.repos}>
        {repos
          .filter(({ name }: { name: string }) => {
            const paramSearch = searchParams.get('search');
            if (paramSearch) return name.includes(paramSearch);
            return true;
          })
          .filter((el: any) => {
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
          .map((repo: any) => {
            return (
              <Link
                to={`/repo/${repo.name}`}
                className={styles.card__link}
                key={repo.id}
              >
                <Card
                  image={repo.owner.avatar_url}
                  title={repo.name}
                  subtitle={repo.owner.login}
                  content={
                    <>
                      <div>
                        <span className={styles.star}>
                          {repo.stargazers_count}
                        </span>
                        <span>{'Updated ' + toDate(repo.updated_at)}</span>
                      </div>
                    </>
                  }
                />
              </Link>
            );
          })}
      </div>
    </div>
  );
};
