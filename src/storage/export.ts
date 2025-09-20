// src/storage/export.ts
import { db } from "./db";

export async function exportAllToJson() {
  const [projects, categories, contacts, tasks] = await Promise.all([
    db.projects.toArray(),
    db.categories.toArray(),
    db.contacts.toArray(),
    db.tasks.toArray(),
  ]);

  return {
    meta: { v: 1, exportedAt: new Date().toISOString() },
    projects,
    categories,
    contacts,
    tasks,
  };
}

export async function downloadJson(payload: any, filename = "wichert-os-export.json") {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
