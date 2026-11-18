import { NavLink } from "react-router-dom";

export function Logo({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  const mark = tone === "paper" ? "bg-paper text-sage-deep" : "bg-sage-deep text-paper";
  const word = tone === "paper" ? "text-paper" : "text-ink";
  return (
    <NavLink to="/" className="inline-flex items-center gap-2.5 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage-deep">
      <span className={`grid h-9 w-9 place-items-center rounded-2xl text-sm font-semibold ${mark}`} aria-hidden="true">
        Q
      </span>
      <span className={`font-display text-xl tracking-tight ${word}`}>QFlow</span>
    </NavLink>
  );
}
