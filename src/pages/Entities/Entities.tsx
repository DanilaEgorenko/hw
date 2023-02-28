import { useState } from 'react';

import { Button } from '@components/Button/Button';
import { Input } from '@components/Input/Input';
import { MultiDropdown } from '@components/MultiDropdown/MultiDropdown';
import { useSearchParams } from 'react-router-dom';

import styles from './Entities.module.scss';
import { RepoList } from './RepoList';

interface IType {
  checked: boolean;
  key: string;
  value: string;
}

export const Entities: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchVal, setSearchVal] = useState<string>(
    searchParams.get('search') || ''
  );
  const [type] = useState<string>(searchParams.get('type') || '');
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
  type.split(';').map((type: string) => {
    types.map((el: IType) => {
      if (el.key === type) el.checked = true;
    });
  });
  const [checked, setChecked] = useState<any>(
    types.filter((el: IType) => el.checked)
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
      <RepoList searchParams={searchParams} />
    </div>
  );
};
