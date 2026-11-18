import { NavLink, Outlet, Link } from "react-router-dom";
import { Logo } from "../brand/Logo";
import { Monitor } from "lucide-react";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/queue", label: "Live queue", end: false },
  { to: "/admin/counters", label: "Counters", end: false },
  { to: "/admin/services", label: "Services", end: false },
  { to: "/admin/controls", label: "Queue controls", end: false },
];

export function AdminLayout() {
  return (
    <div className="min-h-svh bg-paper text-ink md:grid md:grid-cols-[15.5rem_1fr]">
      {/* ── Sidebar ── */}
      <aside className="bg-sage-deep text-paper md:min-h-svh">
        <div className="px-5 py-5">
          <Logo tone="paper" />
          <p className="mt-3 text-sm text-sage/80">Staff desk</p>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto px-3 pb-4 md:block md:space-y-1 md:px-3"
          aria-label="Staff"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block whitespace-nowrap rounded-2xl px-3 py-2.5 text-sm transition ${
                  isActive ? "bg-paper text-ink" : "text-paper/90 hover:bg-white/10"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Public display link */}
        <div className="mt-auto border-t border-white/10 px-3 py-4">
          <Link
            to="/display"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-paper/70 hover:bg-white/10 hover:text-paper/90 transition"
          >
            <Monitor size={15} aria-hidden />
            Public display ↗
          </Link>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div>
        <header className="flex items-center justify-between border-b border-line px-5 py-4 md:px-8">
          <p className="text-sm text-ink-soft">Cedar Bay demo · no sign-in yet</p>
          <NavLink
            to="/"
            className="text-sm font-medium text-sage-deep underline-offset-4 hover:underline"
          >
            Customer site
          </NavLink>
        </header>
        <main className="px-5 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
