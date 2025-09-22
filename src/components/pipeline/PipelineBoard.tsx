import { DndContext, DragEndEvent, DragStartEvent, DragOverEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePipeline } from "@/store/pipeline";
import type { PipelineStage } from "@/types/pipeline";
import { PipelineColumn } from "./PipelineColumn";

const STAGES: PipelineStage[] = ["lead", "contacted", "negotiation", "customer"];

export default function PipelineBoard() {
  const { itemsByStage, load, seedIfEmpty, addItem, moveItem, reorderInStage } = usePipeline();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await load();
      await seedIfEmpty();
    })();
  }, [load, seedIfEmpty]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const columnItems = useMemo(() => STAGES.map(s => itemsByStage[s] ?? []), [itemsByStage]);

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(String(e.active.id));
  };

  const handleDragOver = (_e: DragOverEvent) => {
    // optional: visuelles Feedback
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Finde Stage/Index von active & over
    let fromStage: PipelineStage | null = null;
    let toStage: PipelineStage | null = null;
    let fromIndex = -1;
    let toIndex = -1;

    for (const s of STAGES) {
      const arr = itemsByStage[s] ?? [];
      const aIdx = arr.findIndex(i => i.id === activeId);
      const oIdx = arr.findIndex(i => i.id === overId);
      if (aIdx !== -1) { fromStage = s; fromIndex = aIdx; }
      if (oIdx !== -1) { toStage = s; toIndex = oIdx; }
    }

    if (!fromStage) return;

    // Drop auf leere Spalte?
    if (!toStage) {
      // Versuch: wenn over id eine Spalte repräsentiert (optional), hier simpel abbrechen
      return;
    }

    if (fromStage === toStage) {
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        await reorderInStage(toStage, fromIndex, toIndex);
      }
    } else {
      await moveItem(activeId, toStage, Math.max(0, toIndex));
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Pipeline</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAGES.map((stage, idx) => (
            <PipelineColumn
              key={stage}
              stage={stage}
              items={columnItems[idx]}
              onAdd={() => addItem({ stage, title: "Neuer Deal" })}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
