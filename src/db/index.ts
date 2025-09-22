import Dexie, { Table } from "dexie";
import type { PipelineItem } from "@/types/pipeline";

class WichertOSDB extends Dexie {
  pipeline_items!: Table<PipelineItem, string>;
  // TODO: weitere Tabellen (contacts, tasks, ...) hier typisieren

  constructor() {
    super("WichertOSDB");
    // Falls du schon Versionen hast: erhöhe .version(X) und füge .stores({...})-Feld hinzu
    this.version(1).stores({
      pipeline_items: "id, stage, order, updatedAt", // indexe
    });
  }
}

export const db = new WichertOSDB();
