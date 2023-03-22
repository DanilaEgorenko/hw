import React, { useCallback, useContext, useEffect } from 'react';

import { Button } from '@components/Button/Button';
import { Input } from '@components/Input/Input';
import { MultiDropdown } from '@components/MultiDropdown/MultiDropdown';
import { Pagination } from '@components/Pagination/Pagination';
import { Option } from '@entities/multiDropdown/client';
import { IType } from '@entities/reposList/client';
import { useLocalStore } from '@hooks/useLocalStore';
import ReposListStore from '@store/ReposListStore';
import { observer } from 'mobx-react-lite';
import { useSearchParams } from 'react-router-dom';

import { ContextRootStore } from '../../index';
import { RepoList } from './RepoList/RepoList';
import styles from './ReposList.module.scss';

export const ReposList: React.FC = observer(() => {
  const root = useContext(ContextRootStore);
  const reposList = useLocalStore(() => new ReposListStore(root));
  useEffect(() => {
    reposList.getOrganizationReposList({
      organizationName: 'ktsstudio',
    });
  }, [reposList]);
  reposList.type.split(';').map((type: string) => {
    reposList.types.map((el: IType) => {
      if (el.key === type) el.checked = true;
    });
  });
  const handleInput = useCallback(
    (value: string) => {
      reposList.setSearchVal(value);
    },
    [reposList]
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const handleSearch = useCallback(() => {
    searchParams.set('search', reposList.searchVal);
    setSearchParams(searchParams);
    reposList._rootStore?._searchParamsStore.setParam(
      'search',
      reposList.searchVal
    );
    reposList.getOrganizationReposList({
      organizationName: 'ktsstudio',
    });
  }, [reposList, searchParams, setSearchParams]);

  const handleMultiDropdown = useCallback(
    (val: Option[]) => {
      searchParams.set('type', val.map((el) => el.key).join(';'));
      setSearchParams(searchParams);
      reposList._rootStore?._searchParamsStore.setParam('type', reposList.type);
      reposList.setType(val.map((el) => el.key).join(';'));
      reposList.getOrganizationReposList({
        organizationName: 'ktsstudio',
      });
    },
    [reposList, searchParams, setSearchParams]
  );

  return (
    <div className={styles.entities}>
      <div className={styles.entities__flex}>
        <Input
          value={reposList.searchVal}
          onChange={(e) => handleInput(e)}
          placeholder="Enter organization name"
        />
        <Button className="button__search" onClick={handleSearch} />
      </div>
      <div className={styles.entities__flex}>
        <h1>Repositories</h1>
        <MultiDropdown
          options={reposList.types}
          value={reposList.checked}
          onChange={(val) => handleMultiDropdown(val)}
          pluralizeOptions={(value) =>
            value.length ? value.map((el) => el.value).join(', ') : 'Type'
          }
          className="select"
        />
      </div>
      <RepoList reposList={reposList} />
      <Pagination reposStore={reposList} />
    </div>
  );
});
