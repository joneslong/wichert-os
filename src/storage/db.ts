// src/storage/db.ts
import Dexie, { Table } from "dexie";

export interface Project {
  id: string;
  name: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  projectId: string;
}

export type TaskStatus = "open" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  done: boolean;
  status: TaskStatus;
  priority: number;
  urgent: boolean;
  due?: string;
  projectId?: string;
  categoryId?: string;
  tags?: string[];
  persons?: string[];
  contactId?: string;
  source?: string;
  notes?: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  projectId: string;   // z. B. "p-biz" oder "p-family"
  group?: string;      // z. B. "Copywriting" oder "Familie"
}

export class WichertDB extends Dexie {
  projects!: Table<Project, string>;
  categories!: Table<Category, string>;
  tasks!: Table<Task, string>;
  contacts!: Table<Contact, string>;

  constructor() {
    super("WichertOSDB");

    this.version(1).stores({
      projects: "id,name",
      categories: "id,projectId,name",
      tasks: "id,projectId,categoryId,status,priority,urgent,due",
      contacts: "id,projectId,group,name,email,phone",
    });
  }
}

export const db = new WichertDB();
