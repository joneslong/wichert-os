import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { version } from '../../shared/version';

export default function AppShell() {
  const { pathname } = useLocation();
  const isActive = (p: string) =>
    pathname === p ? { fontWeight: 700, textDecoration: 'underline' } : {};

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: '100vh' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '10px 16px', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <strong>Wichert OS {version}</strong>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link to="/crm" style={isActive('/crm')}>Kontakte</Link>
            <Link to="/crm/tasks" style={isActive('/crm/tasks')}>Aufgaben</Link>
          </nav>
        </div>
        <div style={{ opacity: .6 }}>Modular Base</div>
      </header>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
