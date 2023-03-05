import { useCallback, useState } from 'react';

import { Button } from '@components/Button/Button';
import { Input } from '@components/Input/Input';
import { MultiDropdown, Option } from '@components/MultiDropdown/MultiDropdown';
import { IType } from '@entities/reposList/client';
import ReposListStore from '@store/ReposListStore';
import SearchParamsStore from '@store/SearchParamsStore';
import { observer } from 'mobx-react-lite';
import { useSearchParams } from 'react-router-dom';

import { RepoList } from './RepoList/RepoList';
import styles from './ReposList.module.scss';

export const Entities: React.FC = observer(() => {
  const reposList = new ReposListStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const types: IType[] = [
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
  reposList.type.split(';').map((type: string) => {
    types.map((el: IType) => {
      if (el.key === type) el.checked = true;
    });
  });
  const [checked, setChecked] = useState<Option[]>(
    types.filter((el: IType) => el.checked)
  );
  const handleInput = useCallback(
    (value: string) => reposList.setSearchVal(value),
    [reposList]
  );
  const searchParamsStore = new SearchParamsStore();
  const handleSearch = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      searchParamsStore.setSearchParams({
        target: 'search',
        value: reposList.searchVal,
      });
    },
    [reposList.searchVal]
  );

  return (
    <div className={styles.entities}>
      <div className={styles.entities__flex}>
        <Input
          value={reposList.searchVal}
          onChange={handleInput}
          placeholder="Enter organization name"
        />
        <Button className="button__search" onClick={(e) => handleSearch} />
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
      <RepoList />
    </div>
  );
});
