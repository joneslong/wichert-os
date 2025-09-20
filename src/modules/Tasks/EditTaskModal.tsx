// src/modules/Tasks/EditTaskModal.tsx
import React, { useState, useEffect } from "react";
import { Modal } from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Contact, Task, TaskStatus } from "../../storage/db";

// 👉 Falls du Chip global brauchst, kannst du ihn hier nochmal definieren
function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-full border ${
        active
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      }`}
    >
      {children}
    </button>
  );
}

const FAMILY_PERSONS = [
  "Helen",
  "Jonas",
  "Lotte",
  "Malte",
  "Lucia",
  "Irene",
  "Evelyn",
];
const BIZ_TAGS = ["Copywriting", "CRM", "Garten/Haus", "IT-Service"];
const FAMILY_TAGS = ["Hobby", "Schule", "Kindergarten", "Familie"];

function EditTaskModal({
  open,
  onClose,
  task,
  contacts,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  contacts: Contact[];
  onSave: (t: Task) => void;
}) {
  const [draft, setDraft] = useState<Task | null>(task);

  useEffect(() => {
    setDraft(task);
  }, [task]);

  if (!draft) return null;

  const tagPool = draft.projectId === "p-biz" ? BIZ_TAGS : FAMILY_TAGS;

  const toggleTag = (tag: string) => {
    const set = new Set(draft.tags || []);
    if (set.has(tag)) set.delete(tag);
    else set.add(tag);
    setDraft({ ...draft, tags: Array.from(set) });
  };

  const togglePerson = (who: string) => {
    const set = new Set(draft.persons || []);
    if (set.has(who)) set.delete(who);
    else set.add(who);
    setDraft({ ...draft, persons: Array.from(set) });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Aufgabe bearbeiten"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            onClick={() => {
              if (draft) onSave(draft);
              onClose();
            }}
          >
            Speichern
          </Button>
        </div>
      }
    >
      <div className="space-y-3 text-sm">
        <div>
          <label className="block text-xs opacity-70 mb-1">Titel</label>
          <Input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs opacity-70 mb-1">Status</label>
            <select
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1"
              value={draft.status}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  status: e.target.value as TaskStatus,
                  done: e.target.value === "done",
                })
              }
            >
              <option value="open">offen</option>
              <option value="in_progress">in Arbeit</option>
              <option value="done">erledigt</option>
            </select>
          </div>
          <div>
            <label className="block text-xs opacity-70 mb-1">Priorität</label>
            <select
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1"
              value={draft.priority}
              onChange={(e) =>
                setDraft({ ...draft, priority: parseInt(e.target.value, 10) })
              }
            >
              <option value={1}>Prio 1 (hoch)</option>
              <option value={2}>Prio 2</option>
              <option value={3}>Prio 3 (niedrig)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs opacity-70 mb-1">Fällig am</label>
            <Input
              type="date"
              value={draft.due || ""}
              onChange={(e) =>
                setDraft({ ...draft, due: e.target.value || undefined })
              }
            />
          </div>
          <div className="flex items-end gap-2">
            <Checkbox
              checked={draft.urgent}
              onCheckedChange={(v) => setDraft({ ...draft, urgent: !!v })}
            />
            <span>Dringlich</span>
          </div>
        </div>

        <div>
          <label className="block text-xs opacity-70 mb-1">
            Kontakt verknüpfen
          </label>
          <select
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1"
            value={draft.contactId || ""}
            onChange={(e) =>
              setDraft({ ...draft, contactId: e.target.value || undefined })
            }
          >
            <option value="">— Kein Kontakt —</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.email ? ` – ${c.email}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs opacity-70 mb-1">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tagPool.map((tag) => (
              <Chip
                key={tag}
                active={draft.tags?.includes(tag)}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs opacity-70 mb-1">
            Beteiligte Personen
          </label>
          <div className="flex flex-wrap gap-2">
            {FAMILY_PERSONS.map((p) => (
              <Chip
                key={p}
                active={draft.persons?.includes(p)}
                onClick={() => togglePerson(p)}
              >
                {p}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs opacity-70 mb-1">Notizen</label>
          <Textarea
            value={draft.notes || ""}
            onChange={(e) =>
              setDraft({ ...draft, notes: e.target.value })
            }
          />
        </div>
      </div>
    </Modal>
  );
}

export default EditTaskModal;
