import * as React from "react";

export type Command = {
  id: string;
  label: string;
  hint?: string;
  onRun: () => void;
};

export default function CommandPalette({
  open, onClose, commands
}: {
  open: boolean;
  onClose: () => void;
  commands: Command[];
}) {
  const [q, setQ] = React.useState("");
  React.useEffect(() => { if (!open) setQ(""); }, [open]);

  const filtered = React.useMemo(() => {
    const s = q.toLowerCase().trim();
    return !s ? commands : commands.filter(c =>
      c.label.toLowerCase().includes(s) || (c.hint || "").toLowerCase().includes(s));
  }, [q, commands]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center pt-[10vh] p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 border dark:border-neutral-700 shadow-2xl">
          <div className="p-3 border-b dark:border-neutral-700">
            <input
              autoFocus
              placeholder="Befehl suchen… (z. B. 'Neue Aufgabe')"
              className="w-full bg-transparent outline-none text-sm"
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => { if (e.key === "Escape") onClose(); }}
            />
          </div>
          <div className="max-h-[50vh] overflow-auto">
            {filtered.length ? filtered.map(c => (
              <button key={c.id}
                onClick={() => { c.onRun(); onClose(); }}
                className="w-full text-left px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <div className="text-sm">{c.label}</div>
                {c.hint ? <div className="text-xs opacity-60">{c.hint}</div> : null}
              </button>
            )) : <div className="px-3 py-6 text-sm opacity-60">Nichts gefunden.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
