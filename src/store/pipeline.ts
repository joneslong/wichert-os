import { create } from "zustand";
import { db } from "@/db";
import type { PipelineItem, PipelineStage } from "@/types/pipeline";
import { nanoid } from "nanoid";

type PipelineState = {
  itemsByStage: Record<PipelineStage, PipelineItem[]>;
  loading: boolean;
  load: () => Promise<void>;
  addItem: (init: Partial<PipelineItem>) => Promise<PipelineItem>;
  moveItem: (id: string, toStage: PipelineStage, toIndex?: number) => Promise<void>;
  reorderInStage: (stage: PipelineStage, fromIndex: number, toIndex: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  seedIfEmpty: () => Promise<void>;
};

const stages: PipelineStage[] = ["lead", "contacted", "negotiation", "customer"];

export const usePipeline = create<PipelineState>((set, get) => ({
  itemsByStage: { lead: [], contacted: [], negotiation: [], customer: [] },
  loading: false,

  load: async () => {
    set({ loading: true });
    const all = await db.pipeline_items.orderBy("updatedAt").reverse().toArray();
    const map: Record<PipelineStage, PipelineItem[]> = { lead: [], contacted: [], negotiation: [], customer: [] };
    for (const s of stages) {
      map[s] = all.filter(i => i.stage === s).sort((a, b) => a.order - b.order);
    }
    set({ itemsByStage: map, loading: false });
  },

  addItem: async (init) => {
    const now = Date.now();
    const stage = (init.stage ?? "lead") as PipelineStage;
    const current = get().itemsByStage[stage] ?? [];
    const item: PipelineItem = {
      id: init.id ?? nanoid(),
      title: init.title ?? "Neuer Lead",
      contactId: init.contactId,
      value: init.value,
      stage,
      order: current.length,
      notes: init.notes ?? "",
      createdAt: now,
      updatedAt: now,
    };
    await db.pipeline_items.add(item);
    await get().load();
    return item;
  },

  moveItem: async (id, toStage, toIndex = 0) => {
    const fromStage = stages.find(s => get().itemsByStage[s].some(i => i.id === id));
    if (!fromStage) return;

    const from = [...get().itemsByStage[fromStage]];
    const idx = from.findIndex(i => i.id === id);
    const [item] = from.splice(idx, 1);

    // Reindex from stage
    from.forEach((i, ix) => i.order = ix);

    const to = [...get().itemsByStage[toStage]];
    to.splice(toIndex, 0, { ...item, stage: toStage });
    to.forEach((i, ix) => i.order = ix);

    // Persist
    await db.transaction("readwrite", db.pipeline_items, async () => {
      // update all affected
      await Promise.all(from.map(i => db.pipeline_items.update(i.id, { order: i.order, updatedAt: Date.now() })));
      await Promise.all(to.map(i => db.pipeline_items.update(i.id, { stage: i.stage, order: i.order, updatedAt: Date.now() })));
    });

    await get().load();
  },

  reorderInStage: async (stage, fromIndex, toIndex) => {
    const arr = [...get().itemsByStage[stage]];
    const [moved] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, moved);
    arr.forEach((i, ix) => i.order = ix);
    await db.transaction("readwrite", db.pipeline_items, async () => {
      await Promise.all(arr.map(i => db.pipeline_items.update(i.id, { order: i.order, updatedAt: Date.now() })));
    });
    await get().load();
  },

  removeItem: async (id) => {
    await db.pipeline_items.delete(id);
    await get().load();
  },

  seedIfEmpty: async () => {
    const count = await db.pipeline_items.count();
    if (count > 0) return;
    await db.pipeline_items.bulkAdd([
      { id: nanoid(), title: "PV Müller GmbH", stage: "lead", order: 0, createdAt: Date.now(), updatedAt: Date.now() },
      { id: nanoid(), title: "Elektro Wuschech", stage: "contacted", order: 0, createdAt: Date.now(), updatedAt: Date.now() },
      { id: nanoid(), title: "Solarfix Saar", stage: "negotiation", order: 0, createdAt: Date.now(), updatedAt: Date.now() },
      { id: nanoid(), title: "E-Mobil Plus", stage: "customer", order: 0, createdAt: Date.now(), updatedAt: Date.now() },
    ] as any);
    await get().load();
  },
}));
