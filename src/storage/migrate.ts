// src/storage/migrate.ts
import { db, Project, Category, Task } from "./db";

/**
 * Prüft, ob bereits Daten in Dexie sind. Falls leer, importiert aus localStorage (falls vorhanden).
 * Danach localStorage leeren (nur die Keys, die wir genutzt haben).
 */
export async function migrateLocalStorageOnce(): Promise<void> {
  const hasProjects = await db.projects.count();
  const hasTasks = await db.tasks.count();
  const hasCategories = await db.categories.count();

  if (hasProjects || hasTasks || hasCategories) {
    // Es sind schon Daten in Dexie -> nichts tun
    return;
  }

  const rawProjects = localStorage.getItem("projects");
  const rawTasks = localStorage.getItem("tasks");

  if (!rawProjects && !rawTasks) return;

  try {
    // Alte Struktur aus App.tsx (seedProjects/seedTasks) importieren
    const projectsOld: any[] = rawProjects ? JSON.parse(rawProjects) : [];
    const tasksOld: any[] = rawTasks ? JSON.parse(rawTasks) : [];

    // Alte Projekte hatten categories IN sich – wir normalisieren:
    const projects: Project[] = projectsOld.map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color,
    }));

    const categories: Category[] = projectsOld.flatMap((p: any) =>
      (p.categories || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        projectId: c.projectId,
      }))
    );

    const tasks: Task[] = tasksOld.map((t) => ({
      id: t.id,
      title: t.title,
      done: !!t.done,
      due: t.due,
      projectId: t.projectId,
      categoryId: t.categoryId,
      tags: t.tags || [],
      notes: t.notes,
      source: t.source,
    }));

    await db.transaction("rw", db.projects, db.categories, db.tasks, async () => {
      if (projects.length) await db.projects.bulkAdd(projects);
      if (categories.length) await db.categories.bulkAdd(categories);
      if (tasks.length) await db.tasks.bulkAdd(tasks);
    });

    // Nur unsere Keys entfernen – sonst nichts anfassen:
    localStorage.removeItem("projects");
    localStorage.removeItem("tasks");
  } catch (e) {
    console.error("Migration fehlgeschlagen:", e);
    // im Fehlerfall NICHT localStorage löschen
  }
}
