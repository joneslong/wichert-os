import { NavLink } from "react-router-dom";

const base = "px-3 py-1.5 rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
const idle = "text-neutral-800 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800";
const active = "bg-indigo-600 text-white hover:bg-indigo-600";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-indigo-500" />
          <span className="text-sm font-semibold">Wichert OS</span>
        </div>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={({isActive}) => `${base} ${isActive ? active : idle}`}>Home</NavLink>
          <NavLink to="/pipeline" className={({isActive}) => `${base} ${isActive ? active : idle}`}>Pipeline</NavLink>
        </nav>
      </div>
    </header>
  );
}
