import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AppProviders } from './providers/AppProviders';
import { ErrorBoundary } from './providers/ErrorBoundary';
import { exportAllToJson, downloadJson } from "../storage/export";
import { importAllFromJson } from "../storage/import";

const doExportDB = async () => {
  const dump = await exportAllToJson();
  await downloadJson(dump);
};

const doImportDB = async (file: File) => {
  const text = await file.text();
  const dump = JSON.parse(text);
  await importAllFromJson(dump);
  const [p, c, ct, t] = await Promise.all([
    db.projects.toArray(),
    db.categories.toArray(),
    db.contacts.toArray(),
    db.tasks.toArray(),
  ]);
  setProjects(p); setCategories(c); setContacts(ct); setTasks(t);
};

/**
 * App-Wrapper:
 * - ErrorBoundary für globale Fehler
 * - AppProviders (EventBus, Storage, Deps)
 * - RouterProvider für alle Modul-Routen
 */
export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
}
