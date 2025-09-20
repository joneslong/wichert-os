import React, { useMemo } from "react";
import { Task, TaskStatus } from "../../storage/db";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ListTodo, CheckCircle2, Trash2, Edit2, AlertTriangle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import classNames from "classnames";
import { IconButton } from "../../components/ui/IconButton";
import { useToast } from "../../components/ui/Toast";




function StatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, string> = {
    open: "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
    in_progress: "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200",
    done: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${map[status]}`}>
      {status === "open" ? "offen" : status === "in_progress" ? "in Arbeit" : "erledigt"}
    </span>
  );
}



function TaskItemRow({
  task,
  onToggleDone,
  onRemove,
  onOpenEdit,
  onChangeStatus,
  onChangePrio,
  onToggleUrgent,
}: {
  task: Task;
  onToggleDone: () => void;
  onRemove: () => void;
  onOpenEdit: () => void;
  onChangeStatus: (s: TaskStatus) => void;
  onChangePrio: (p: number) => void;
  onToggleUrgent: () => void;
}) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800">
      <Checkbox checked={task.status === "done"} onCheckedChange={onToggleDone} />
      <div className="flex-1">
        <div
          className={classNames(
            "text-sm flex flex-wrap items-center gap-2",
            task.status === "done" && "line-through opacity-60"
          )}
        >
          {task.title}
          {task.urgent && <AlertTriangle className="w-3.5 h-3.5" />}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
          <StatusBadge status={task.status} />
          {task.due && <Badge variant="outline">Fällig: {task.due}</Badge>}
          {task.tags?.slice(0, 3).map((t) => (
            <Badge key={t} variant="secondary">
              #{t}
            </Badge>
          ))}
          {task.persons?.length ? (
            <Badge variant="outline">{task.persons.join(", ")}</Badge>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <select
            title="Status"
            value={task.status}
            onChange={(e) => onChangeStatus(e.target.value as TaskStatus)}
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1 text-xs"
          >
            <option value="open">offen</option>
            <option value="in_progress">in Arbeit</option>
            <option value="done">erledigt</option>
          </select>
          <select
            title="Priorität"
            value={task.priority}
            onChange={(e) => onChangePrio(parseInt(e.target.value, 10))}
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1 text-xs"
          >
            <option value={1}>Prio 1 (hoch)</option>
            <option value={2}>Prio 2</option>
            <option value={3}>Prio 3 (niedrig)</option>
          </select>
          <IconButton
  title={task.urgent ? "Dringend" : "Dringend markieren"}
  onClick={onToggleUrgent}
>
  <AlertTriangle className={`w-4 h-4 ${task.urgent ? "text-amber-500" : "opacity-60"}`} />
</IconButton>

          <Button variant="secondary" size="sm" onClick={onOpenEdit}>
            <Edit2 className="w-4 h-4 mr-1" />
            Bearbeiten
          </Button>
        </div>
      </div>
      <Button size="icon" variant="ghost" onClick={onRemove}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function TasksPanel({
  tasks,
  setTasks,
  sortBy,
  sortDir,
  onOpenEditFor,
}: {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  sortBy: "due" | "priority" | "title";
  sortDir: "asc" | "desc";
  onOpenEditFor: (t: Task) => void;
}) {
  
  const sorted = useMemo(() => {
    const copy = [...tasks];
    copy.sort((a, b) => {
      let av: any, bv: any;
      if (sortBy === "due") {
        av = a.due || "";
        bv = b.due || "";
      } else if (sortBy === "priority") {
        av = a.priority;
        bv = b.priority;
      } else {
        av = (a.title || "").toLowerCase();
        bv = (b.title || "").toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [tasks, sortBy, sortDir]);


const showToast = useToast();
  const pending = sorted.filter((t) => t.status !== "done");
  const done = sorted.filter((t) => t.status === "done").slice(-5);

  const change = (id: string, patch: Partial<Task>) =>
    setTasks((old) =>
      old.map((x) =>
        x.id === id
          ? { ...x, ...patch, done: "status" in patch ? patch.status === "done" : x.done }
          : x
      )
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="w-4 h-4" />
            Offene Aufgaben
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pending.map((t) => (
              <TaskItemRow
                key={t.id}
                task={t}
                onToggleDone={() => change(t.id, { status: t.status === "done" ? "open" : "done" })}
                onRemove={() => {
  const prev = t;
  setTasks((old) => old.filter((x) => x.id !== t.id));
  showToast(`Aufgabe „${t.title}“ gelöscht`, {
    actionLabel: "Rückgängig",
    onAction: () => setTasks((old) => [prev, ...old]),
  });
}}

                onOpenEdit={() => onOpenEditFor(t)}
                onChangeStatus={(s) => {
  change(t.id, { status: s });
  showToast(`Status → ${s === "open" ? "offen" : s === "in_progress" ? "in Arbeit" : "erledigt"}`);
}}

                onChangePrio={(p) => change(t.id, { priority: p })}
                onToggleUrgent={() => {
  change(t.id, { urgent: !t.urgent });
  showToast(!t.urgent ? "Als dringend markiert" : "Dringlich entfernt");
}}

              />
            ))}
            {!pending.length && (
              <div className="text-sm text-neutral-500">
                Alles erledigt. (Für heute 😉)
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Zuletzt erledigt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {done.map((t) => (
              <TaskItemRow
                key={t.id}
                task={t}
                onToggleDone={() => {}}
                onRemove={() => {}}
                onOpenEdit={() => onOpenEditFor(t)}
                onChangeStatus={() => {}}
                onChangePrio={() => {}}
                onToggleUrgent={() => {}}
              />
            ))}
            {!done.length && (
              <div className="text-sm text-neutral-500">
                Noch nichts erledigt – kommt gleich! 💪
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
