import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { PipelineItem, PipelineStage } from "@/types/pipeline";
import { PipelineCard } from "./PipelineCard";

const LABELS: Record<PipelineStage, string> = {
  lead: "Lead",
  contacted: "Kontaktiert",
  negotiation: "Im Gespräch",
  customer: "Kunde",
};

export function PipelineColumn({
  stage, items, onAdd,
}: { stage: PipelineStage; items: PipelineItem[]; onAdd: () => void; }) {
  return (
    <div className="flex flex-col gap-3 bg-neutral-50 dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 min-h-[60vh]">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold">{LABELS[stage]} <span className="opacity-60 text-sm">({items.length})</span></h3>
        <button onClick={onAdd} className="text-sm px-2 py-1 rounded-xl border hover:bg-neutral-100 dark:hover:bg-neutral-800">
          + Neu
        </button>
      </div>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {items.map(item => <PipelineCard key={item.id} item={item} />)}
        </div>
      </SortableContext>
    </div>
  );
}
