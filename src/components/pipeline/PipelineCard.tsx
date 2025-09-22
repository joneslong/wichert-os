import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PipelineItem } from "@/types/pipeline";

export function PipelineCard({ item }: { item: PipelineItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="rounded-2xl shadow p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 cursor-grab active:cursor-grabbing">
      <div className="text-sm font-medium">{item.title}</div>
      {typeof item.value === "number" && (
        <div className="text-xs opacity-70 mt-1">Wert: {item.value.toLocaleString()} €</div>
      )}
    </div>
  );
}
