// src/components/ErrorBoundary.tsx
import React from "react";

type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
          <h2>Ups, da ist was schiefgelaufen.</h2>
          <p style={{ opacity: 0.8 }}>Bitte öffne die Browser-Konsole (F12 → „Console“) für Details.</p>
          <pre style={{
            marginTop: 16, padding: 12, background: "#111", color: "#eee",
            borderRadius: 8, overflow: "auto"
          }}>
            {String(this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
