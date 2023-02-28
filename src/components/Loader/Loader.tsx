import React from 'react';

import styles from './Loader.module.scss';

export enum LoaderSize {
  s = 's',
  m = 'm',
  l = 'l',
}

export type LoaderProps = {
  loading?: boolean;
  size?: LoaderSize;
  className?: string;
};

export const Loader: React.FC<LoaderProps> = ({
  loading = true,
  size = 'm',
  className,
}) => {
  if (!loading) {
    return null;
  }
  return (
    <div
      className={`${styles.loader} ${styles[`loader-size-${size}`]} ${
        className && styles[className]
      }`}
    ></div>
  );
};
