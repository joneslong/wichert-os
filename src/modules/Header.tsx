import React from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Github, Moon, Sun, Settings2, Plus, UserPlus } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";



export default function Header({
  onNewTask,
  onNewContact,
  onExportDB,
  onImportDB,
  globalQuery,
  setGlobalQuery,
}: {
  onNewTask: () => void;
  onNewContact: () => void;
  onExportDB: () => void;
  onImportDB: (file: File) => void;
  globalQuery: string;
  setGlobalQuery: (s: string) => void;
}) {
 const { dark, setDark } = useDarkMode();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-semibold tracking-tight">Wichert OS</div>
        <Badge variant="secondary" className="rounded-full">
          Prototype v0.5 (Modular Split)
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onNewTask}>
          <Plus className="w-4 h-4 mr-2" />
          Neue Aufgabe
        </Button>
        <Button variant="secondary" onClick={onNewContact}>
          <UserPlus className="w-4 h-4 mr-2" />
          Neuer Kontakt
        </Button>
      </div>
      <div className="flex items-center gap-2 w-full max-w-xl">
        <Input
          placeholder="Suche…"
          value={globalQuery}
          onChange={(e) => setGlobalQuery(e.target.value)}
        />
        <Button variant="ghost" onClick={onExportDB} title="DB exportieren">
          Export
        </Button>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImportDB(f);
            }}
          />
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800">
            Import
          </span>
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost">
          <Github className="w-4 h-4 mr-2" />
          GitHub
        </Button>
        <Button variant="ghost">
          <Settings2 className="w-4 h-4" />
        </Button>
         <Button
          variant="ghost"
          onClick={() => setDark(!dark)}
          title="Theme umschalten"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
