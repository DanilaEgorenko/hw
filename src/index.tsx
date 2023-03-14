import React from 'react';

// eslint-disable-next-line import/order
import ReactDOM from 'react-dom/client';
import './config/configureMobX';

import { BrowserRouter } from 'react-router-dom';

import { App } from './App';

// eslint-disable-next-line import/order
import RootStore from '@store/RootStore';
import './styles/styles.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const rootStore = new RootStore();
export const ContextRootStore = React.createContext(rootStore);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ContextRootStore.Provider value={rootStore}>
        <App />
      </ContextRootStore.Provider>
    </BrowserRouter>
  </React.StrictMode>
);
