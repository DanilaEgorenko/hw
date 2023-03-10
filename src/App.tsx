import { Repo } from '@pages/Repo/Repo';
import { Entities } from '@pages/ReposList/ReposList';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Entities />} />
        <Route path="/repo">
          <Route path=":repo" element={<Repo />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
