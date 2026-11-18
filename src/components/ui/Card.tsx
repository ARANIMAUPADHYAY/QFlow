import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`rounded-3xl bg-card p-5 shadow-soft ring-1 ring-line/80 ${className}`}>
      {children}
    </article>
  );
}
