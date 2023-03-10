import React from 'react';

import { Loader } from '../Loader/Loader';

export type WithLoaderProps = React.PropsWithChildren<{
  loading: boolean;
}>;

export const WithLoader: React.FC<WithLoaderProps> = ({
  loading,
  children,
}) => {
  return (
    <div>
      {loading && <Loader />}
      {children}
    </div>
  );
};
