import React from 'react';

import { Repo } from '@pages/Repo/Repo';
import { ReposList } from '@pages/ReposList/ReposList';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useQueryParamsStoreInit } from './hooks/useSearchParamsInit';

export const App: React.FC = () => {
  useQueryParamsStoreInit();
  return (
    <Routes>
      <Route path="/" element={<ReposList />} />
      <Route path="/repo">
        <Route path=":repo" element={<Repo />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
