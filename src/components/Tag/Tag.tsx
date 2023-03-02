import React from 'react';

import styles from './Tag.module.scss';

export interface ITag {
  title: string;
}

export const Tag: React.FC<ITag> = React.memo(({ title }) => {
  return <div className={styles.tag}>{title}</div>;
});
