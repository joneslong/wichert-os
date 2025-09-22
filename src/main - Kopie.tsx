import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [err, setErr] = React.useState<null | string>(null);
  React.useEffect(() => {
    const handler = (e: any) => setErr(String(e?.message || e));
    window.addEventListener("error", handler);
    window.addEventListener("unhandledrejection", handler as any);
    return () => {
      window.removeEventListener("error", handler);
      window.removeEventListener("unhandledrejection", handler as any);
    };
  }, []);
  if (err) {
    return <div style={{ padding: 16 }}>
      <h1>Unerwarteter Fehler</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>{err}</pre>
      <p style={{ opacity: 0.7 }}>Öffne die DevTools (F12) für Details.</p>
    </div>;
  }
  return <>{children}</>;
}

const root = document.getElementById("root");
if (!root) {
  document.body.innerHTML = "<pre style='padding:16px'>#root not found</pre>";
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
