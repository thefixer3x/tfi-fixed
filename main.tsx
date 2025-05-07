import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './lib/theme-provider';

// Import global CSS
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="fixer-initiative-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

