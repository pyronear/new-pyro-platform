import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('Root element of the page could not be found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
