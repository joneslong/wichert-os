import React, { useMemo, useState, useEffect } from "react";
import { Contact, Project } from "../../storage/db";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Trash2, Users } from "lucide-react";
import { ContactModal } from "../../components/ui/contact-modal";
import { useToast } from "../../components/ui/Toast";


const BIZ_GROUPS = ["IT-Support", "Copywriting", "Gartenarbeit"];



export default function ContactsPanel({
  contacts,
  setContacts,
  projects,
  activeProjectId,
}: {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  projects: Project[];
  activeProjectId?: string;
}) {
  const [sortBy, setSortBy] = useState<"name" | "project" | "email" | "group">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterProject, setFilterProject] = useState<string | undefined>(activeProjectId);
  const [filterGroup, setFilterGroup] = useState<string | undefined>(undefined);
  const [q, setQ] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState<Contact | null>(null);

  useEffect(() => {
    setFilterProject(activeProjectId);
  }, [activeProjectId]);

  const projectName = (pid: string) => projects.find((p) => p.id === pid)?.name || "—";

  const groupsInProject = useMemo(() => {
    const g = new Set<string>();
    contacts
      .filter((c) => !filterProject || c.projectId === filterProject)
      .forEach((c) => {
        if (c.group) g.add(c.group);
      });
    if (filterProject === "p-biz") BIZ_GROUPS.forEach((x) => g.add(x));
    return Array.from(g);
  }, [contacts, filterProject]);

  const showToast = useToast();

  const filtered = useMemo(() => {
    let list = contacts;
    if (filterProject) list = list.filter((c) => c.projectId === filterProject);
    if (filterGroup) list = list.filter((c) => (c.group || "") === filterGroup);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(s) ||
          (c.email || "").toLowerCase().includes(s) ||
          (c.phone || "").toLowerCase().includes(s)
      );
    }
    const copy = [...list];
    copy.sort((a, b) => {
      let av: any, bv: any;
      if (sortBy === "name") {
        av = (a.name || "").toLowerCase();
        bv = (b.name || "").toLowerCase();
      } else if (sortBy === "email") {
        av = (a.email || "").toLowerCase();
        bv = (b.email || "").toLowerCase();
      } else if (sortBy === "group") {
        av = (a.group || "").toLowerCase();
        bv = (b.group || "").toLowerCase();
      } else {
        av = projectName(a.projectId);
        bv = projectName(b.projectId);
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [contacts, filterProject, filterGroup, q, sortBy, sortDir, projects]);

  const newContact = () => {
    setEdit({
      id: Math.random().toString(36).slice(2),
      name: "",
      projectId: filterProject || (projects[0]?.id ?? "p-family"),
    });
    setShowModal(true);
  };

  const changeGroup = (c: Contact, group: string | undefined) => {
    setContacts((old) => old.map((x) => (x.id === c.id ? { ...x, group } : x)));
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Kontakte
        </CardTitle>
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            placeholder="Suchen…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-9 w-40"
          />
          <select
            className="h-9 rounded-xl border bg-white dark:bg-neutral-900 px-2 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="name">Name</option>
            <option value="project">Projekt</option>
            <option value="email">E-Mail</option>
            <option value="group">Gruppe</option>
          </select>
          <select
            className="h-9 rounded-xl border bg-white dark:bg-neutral-900 px-2 text-sm"
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as any)}
          >
            <option value="asc">▲</option>
            <option value="desc">▼</option>
          </select>
          <select
            className="h-9 rounded-xl border bg-white dark:bg-neutral-900 px-2 text-sm"
            value={filterProject || ""}
            onChange={(e) => {
              setFilterProject(e.target.value || undefined);
              setFilterGroup(undefined);
            }}
          >
            <option value="">Alle Projekte</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            className="h-9 rounded-xl border bg-white dark:bg-neutral-900 px-2 text-sm"
            value={filterGroup || ""}
            onChange={(e) => setFilterGroup(e.target.value || undefined)}
          >
            <option value="">Alle Gruppen</option>
            {groupsInProject.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <Button onClick={newContact}>Kontakt anlegen</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {filtered.map((c) => (
            <div key={c.id} className="py-2 flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">
                  {c.name} <span className="opacity-60 text-xs">· {projectName(c.projectId)}</span>
                </div>
                <div className="text-xs opacity-80">
                  {c.email || "—"} {c.phone ? `· ${c.phone}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {c.projectId === "p-biz" ? (
                  <select
                    className="h-9 rounded-xl border bg-white dark:bg-neutral-900 px-2 text-sm"
                    value={c.group || ""}
                    onChange={(e) => changeGroup(c, e.target.value || undefined)}
                  >
                    <option value="">— Gruppe —</option>
                    {BIZ_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    className="h-9 rounded-xl border bg-white dark:bg-neutral-900 px-2 text-sm"
                    value={c.group || ""}
                    onChange={(e) => changeGroup(c, e.target.value || undefined)}
                  >
                    <option value="">— Gruppe —</option>
                    {groupsInProject.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                )}
                <Button variant="secondary" onClick={() => { setEdit(c); setShowModal(true); }}>
                  Bearbeiten
                </Button>
                <Button
  variant="ghost"
  onClick={() => {
    const prev = c; // Kopie für Undo
    setContacts((old) => old.filter((x) => x.id !== c.id));
    showToast(`Kontakt „${c.name || "Ohne Namen"}“ gelöscht`, {
      actionLabel: "Rückgängig",
      onAction: () => setContacts((old) => [prev, ...old]),
      timeoutMs: 4500,
    });
  }}
>
  <Trash2 className="w-4 h-4" />
</Button>

              </div>
            </div>
          ))}
          {!filtered.length && <div className="text-sm opacity-60 py-6">Keine Kontakte gefunden.</div>}
        </div>
      </CardContent>
      <ContactModal
  open={showModal}
  onClose={() => setShowModal(false)}
  value={edit}
  onSave={(v) => {
    setContacts((old) => {
      const exists = old.some((x) => x.id === v.id);
      return exists ? old.map((x) => (x.id === v.id ? v : x)) : [v, ...old];
    });
    showToast(`Kontakt „${v.name || "Ohne Namen"}“ gespeichert`);
  }}
  projects={projects}
/>

    </Card>
  );
}
