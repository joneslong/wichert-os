import { db } from "./db";

export async function exportAllToJson() {
  const [projects, categories, contacts, tasks] = await Promise.all([
    db.projects.toArray(),
    db.categories.toArray(),
    db.contacts.toArray(),
    db.tasks.toArray(),
  ]);

  return {
    savedAt: new Date().toISOString(),
    version: "db-export-1",
    projects,
    categories,
    contacts,
    tasks,
  };
}

export async function downloadJson(obj: any, filename = "wichert-os-backup.json") {
  const data = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
