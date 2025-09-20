import { db, Project, Category, Contact, Task } from "./db";

type Dump = {
  projects?: Project[];
  categories?: Category[];
  contacts?: Contact[];
  tasks?: Task[];
};

export async function importAllFromJson(dump: Dump) {
  await db.transaction("rw", db.projects, db.categories, db.contacts, db.tasks, async () => {
    await db.projects.clear();
    await db.categories.clear();
    await db.contacts.clear();
    await db.tasks.clear();
    if (dump.projects?.length) await db.projects.bulkAdd(dump.projects);
    if (dump.categories?.length) await db.categories.bulkAdd(dump.categories);
    if (dump.contacts?.length) await db.contacts.bulkAdd(dump.contacts);
    if (dump.tasks?.length) await db.tasks.bulkAdd(dump.tasks);
  });
}
