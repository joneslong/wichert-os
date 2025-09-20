import React from "react";
import { Task } from "../storage/db";

export default function Dashboard({
  tasks,
  onStatClick,
  activeStat,
}: {
  tasks: Task[];
  onStatClick: (kind: "urgent" | "in_progress" | "open" | "all_open" | "done") => void;
  activeStat?: "urgent" | "in_progress" | "open" | "all_open" | "done";
}) {
  const stats = [
    { key: "urgent",     label: "Dringlich",          value: tasks.filter(t => t.urgent && t.status !== "done").length },
    { key: "in_progress",label: "In Arbeit",          value: tasks.filter(t => t.status === "in_progress").length },
    { key: "open",       label: "Offen",              value: tasks.filter(t => t.status === "open").length },
    { key: "all_open",   label: "Alle offen",         value: tasks.filter(t => t.status !== "done").length },
    { key: "done",       label: "Erledigt",           value: tasks.filter(t => t.status === "done").length },
  ] as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      {stats.map(s => {
        const active = activeStat === s.key;
        return (
          <button
            key={s.key}
            onClick={() => onStatClick(s.key)}
            className={`text-left p-3 rounded-xl transition border
                        ${active
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent"
                          : "bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-neutral-200 dark:border-neutral-700"}`}
          >
            <div className={`text-2xl font-semibold ${active ? "" : ""}`}>{s.value}</div>
            <div className={`text-xs opacity-80 ${active ? "" : ""}`}>{s.label}</div>
          </button>
        );
      })}
    </div>
  );
}
