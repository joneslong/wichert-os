import React from 'react';
import type { ModuleDefinition } from './types';

function Lazy({ loader }: { loader: () => Promise<any> }) {
  const Comp = React.lazy(async () => {
    const mod = await loader();
    return { default: mod.default || mod };
  });
  return (
    <React.Suspense fallback={<div style={{ padding: 16 }}>Lädt…</div>}>
      <Comp />
    </React.Suspense>
  );
}

export const modules: ModuleDefinition[] = [
  {
    id: 'crm',
    base: '/crm',
    routes: [
      { path: '/crm',       element: <Lazy loader={() => import('../../modules/crm/screens/Contacts')} /> },
      { path: '/crm/tasks', element: <Lazy loader={() => import('../../modules/crm/screens/Tasks')} /> },
    ],
  },
  // weitere Module später
];
