import * as React from "react";

type ToastMsg = { id: string; text: string; actionLabel?: string; onAction?: () => void; };

const ToastCtx = React.createContext<{
  show: (text: string, opts?: { actionLabel?: string; onAction?: () => void; timeoutMs?: number }) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastMsg[]>([]);

  const show = (text: string, opts?: { actionLabel?: string; onAction?: () => void; timeoutMs?: number }) => {
    const id = Math.random().toString(36).slice(2);
    const msg: ToastMsg = { id, text, actionLabel: opts?.actionLabel, onAction: opts?.onAction };
    setItems((xs) => [...xs, msg]);
    const timeout = opts?.timeoutMs ?? 3500;
    if (timeout > 0) setTimeout(() => dismiss(id), timeout);
  };
  const dismiss = (id: string) => setItems((xs) => xs.filter((x) => x.id !== id));

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2">
        {items.map((m) => (
          <div key={m.id}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-neutral-900 text-white shadow-lg min-w-[260px]">
            <div className="text-sm">{m.text}</div>
            {m.actionLabel ? (
              <button
                className="ml-auto text-xs underline decoration-dotted"
                onClick={() => { m.onAction?.(); dismiss(m.id); }}
              >
                {m.actionLabel}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx.show;
}
