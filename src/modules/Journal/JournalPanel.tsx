// src/modules/Journal/JournalPanel.tsx
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Task } from "../../storage/db";
import { todayISO } from "../../utils/id";
import { useToast } from "../../components/ui/Toast";

function uid() {
  return Math.random().toString(36).slice(2);
}

// Tags via #tag, Fälligkeitsdatum via #due:YYYY-MM-DD
function parseJournal(text: string): Task[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const res: Task[] = [];
  for (const line of lines) {
    const tags = Array.from(line.matchAll(/#([a-zA-Z0-9_-]+)/g)).map((m) => m[1]);
    const dueMatch = line.match(/#due:(\d{4}-\d{2}-\d{2})/);
    const due = dueMatch?.[1];

    let projectId: string | undefined;
    let categoryId: string | undefined;
    const lower = line.toLowerCase();

    // Familie
    if (/helen/.test(lower) || tags.includes("helen")) { projectId = "p-family"; categoryId = "c-helen"; }
    else if (/lotte/.test(lower) || tags.includes("lotte")) { projectId = "p-family"; categoryId = "c-lotte"; }
    else if (/malte/.test(lower) || tags.includes("malte")) { projectId = "p-family"; categoryId = "c-malte"; }

    // Selbstständigkeit
    if (/crm|akquise|lead|kunde|angebot/.test(lower) || tags.includes("crm")) { projectId = "p-biz"; categoryId = "c-crm"; }
    if (/copy|text|salespage|newsletter/.test(lower) || tags.includes("copy")) { projectId = "p-biz"; categoryId = "c-copy"; }
    if (/it|netzwerk|linux|pc|github/.test(lower) || tags.includes("it")) { projectId = "p-biz"; categoryId = "c-it"; }
    if (/garten|rasen|hecke|reparatur/.test(lower) || tags.includes("garten")) { projectId = "p-biz"; categoryId = "c-garten"; }

    res.push({
      id: uid(),
      title: line.replace(/#[^\s]+/g, "").trim(),
      done: false,
      status: "open",
      priority: 2,
      urgent: false,
      due,
      projectId,
      categoryId,
      tags,
      persons: [],
      source: "journal",
    });
  }
  return res;
}

function JournalPanel({
  onImport,
  onOpenAgent,
}: {
  onImport: (ts: Task[]) => void;
  onOpenAgent: () => void;
}) {
  const [text, setText] = useState("");
  const showToast = useToast();

  return (
    <div className="space-y-2">
      <Textarea
        placeholder={`Heute erledigt: Angebot an PV Müller geschickt #crm
Neu: Router im MGH tauschen #it #due:${todayISO()}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[140px]"
      />
      <div className="flex justify-between gap-2">
        <Button variant="ghost" onClick={() => setText("")}>
          Leeren
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onOpenAgent}>
            Mit Assistent öffnen
          </Button>
          <Button
            onClick={() => {
              const items = parseJournal(text);
              onImport(items);
              showToast(items.length ? `${items.length} Aufgaben erstellt` : "Keine Zeilen gefunden");
            }}
          >
            In Aufgaben umwandeln
          </Button>
        </div>
      </div>
    </div>
  );
}

export default JournalPanel;
