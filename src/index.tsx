import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';   // ⬅️ wichtig: neue App aus /app laden
import './index.css';          // optional: globale Styles, falls vorhanden

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
