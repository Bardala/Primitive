import { App } from '@/app/layout';

import React from 'react';
import ReactDOM from 'react-dom/client';

import './core/utils/i18n';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
