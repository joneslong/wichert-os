import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from './shell/AppShell';
import { modules } from './registry/module.registry';

function RouteError() {
  return (
    <div style={{ padding: 24 }}>
      <h2>😕 Unerwarteter Fehler</h2>
      <button onClick={() => window.location.reload()}>Neu laden</button>
    </div>
  );
}

const children = [
  { index: true, element: <Navigate to="/crm" replace /> },
  ...modules.flatMap(m => m.routes),
  { path: '*', element: <div style={{ padding: 16 }}>404 – Seite nicht gefunden</div> },
];

export const router = createBrowserRouter([
  { path: '/', element: <AppShell />, errorElement: <RouteError />, children }
]);
