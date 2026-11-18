import { Menu, X, Bell } from "lucide-react";
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Logo } from "../brand/Logo";
import { buttonClass } from "../ui/Button";
import { useQueue } from "../../context/QueueContext";

const links = [
  { to: "/centres", label: "Centres" },
  { to: "/#how-it-works", label: "How it works" },
  { to: "/history", label: "My tokens" },
];

function itemClass(isActive: boolean) {
  return `rounded-full px-3 py-2 text-sm transition ${
    isActive ? "bg-cream text-ink" : "text-ink-soft hover:bg-cream hover:text-ink"
  }`;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { unreadCount } = useQueue();

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((link) =>
            link.to.startsWith("/#") ? (
              <a key={link.label} href={link.to} className={itemClass(false)}>
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => itemClass(isActive)}
              >
                {link.label}
              </NavLink>
            ),
          )}
          {/* Notifications */}
          <Link
            to="/notifications"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-cream hover:text-ink"
          >
            <Bell size={18} aria-hidden />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-mustard text-[9px] font-bold text-ink">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <NavLink to="/admin" className={`${buttonClass("secondary")} ml-2 px-4`}>
            Staff desk
          </NavLink>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-cream"
          >
            <Bell size={18} aria-hidden />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-mustard" />
            )}
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          className="space-y-1 border-t border-line px-5 py-3 md:hidden"
          aria-label="Mobile"
        >
          {links.map((link) =>
            link.to.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.to}
                className="block rounded-2xl px-3 py-3 text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className="block rounded-2xl px-3 py-3 text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ),
          )}
          <NavLink
            to="/admin"
            className="block rounded-2xl px-3 py-3 text-ink"
            onClick={() => setOpen(false)}
          >
            Staff desk
          </NavLink>
        </nav>
      )}
    </header>
  );
}
