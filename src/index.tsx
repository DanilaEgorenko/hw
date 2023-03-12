import React from 'react';

// eslint-disable-next-line import/order
import ReactDOM from 'react-dom/client';
import './config/configureMobX';

import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import './styles/styles.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
