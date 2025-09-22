import { HashRouter, Routes, Route, Link } from "react-router-dom";
import PipelineBoard from "@/components/pipeline/PipelineBoard";
import AppHeader from "@/components/layout/AppHeader";

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Willkommen bei Wichert OS
      </h1>
      <p className="text-neutral-700 dark:text-neutral-300 mt-2">
        Wähle oben einen Bereich – z. B. <span className="font-medium">Pipeline</span>.
      </p>
    </div>
  );
}


export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-3 py-4">
        
      </main>
    </div>
  );
}
