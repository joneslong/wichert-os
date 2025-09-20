// src/storage/import.ts
import { db, Project, Category, Task, Contact } from "./db";

type Dump = {
  meta?: { v?: number; exportedAt?: string };
  projects?: Project[];
  categories?: Category[];
  contacts?: Contact[];
  tasks?: Task[];
};

/**
 * Importiert einen JSON-Dump. Aktuell: "replace"-Strategie (clear + bulkAdd).
 * Wenn du Merge willst, sag Bescheid – bau ich dir rein.
 */
export async function importAllFromJson(dump: Dump) {
  if (!dump) throw new Error("Import: dump is empty");

  await db.transaction("rw", db.projects, db.categories, db.contacts, db.tasks, async () => {
    if (dump.projects) {
      await db.projects.clear();
      if (dump.projects.length) await db.projects.bulkAdd(dump.projects);
    }
    if (dump.categories) {
      await db.categories.clear();
      if (dump.categories.length) await db.categories.bulkAdd(dump.categories);
    }
    if (dump.contacts) {
      await db.contacts.clear();
      if (dump.contacts.length) await db.contacts.bulkAdd(dump.contacts);
    }
    if (dump.tasks) {
      await db.tasks.clear();
      if (dump.tasks.length) await db.tasks.bulkAdd(dump.tasks);
    }
  });
}
