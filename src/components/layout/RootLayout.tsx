import { NavLink, Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <header className="sticky top-0 z-20 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-4">
          <div className="font-bold">Wichert OS</div>
          <nav className="flex gap-4 text-sm">
            <NavLink to="/" className={({ isActive }) => isActive ? "font-semibold" : "opacity-80 hover:opacity-100"}>Home</NavLink>
            <NavLink to="/tasks" className="opacity-80 hover:opacity-100">Tasks</NavLink>
            <NavLink to="/emails" className="opacity-80 hover:opacity-100">E-Mails</NavLink>
            <NavLink to="/sync" className="opacity-80 hover:opacity-100">Sync</NavLink>
            <NavLink to="/family" className="opacity-80 hover:opacity-100">Familie</NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4">
        <Outlet />
      </main>
    </div>
  );
}
