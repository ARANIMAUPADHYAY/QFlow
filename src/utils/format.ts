import type { ServiceCategory, ServiceStatus } from "../types/centre";
import type { TokenStatus, QueueStatus, CounterStatus } from "../types/queue";

// ─── Wait time ────────────────────────────────────────────────────────────────
export function formatWait(minutes: number) {
  if (minutes < 1) return "Under a minute";
  if (minutes === 1) return "About 1 min";
  if (minutes < 60) return `About ${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

export function peopleLabel(count: number) {
  if (count === 0) return "No one waiting";
  return count === 1 ? "1 person ahead" : `${count} people ahead`;
}

// ─── Timestamps ───────────────────────────────────────────────────────────────
export function formatTimeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Status labels ────────────────────────────────────────────────────────────
export const tokenStatusLabel: Record<TokenStatus, string> = {
  WAITING: "Waiting",
  APPROACHING: "Approaching",
  CALLED: "Called",
  SERVING: "Serving",
  COMPLETED: "Completed",
  SKIPPED: "Skipped",
  CANCELLED: "Cancelled",
  NO_SHOW: "No show",
};

export const tokenStatusTone: Record<
  TokenStatus,
  "sage" | "mustard" | "peach" | "cream" | "closed"
> = {
  WAITING: "cream",
  APPROACHING: "mustard",
  CALLED: "mustard",
  SERVING: "sage",
  COMPLETED: "sage",
  SKIPPED: "closed",
  CANCELLED: "closed",
  NO_SHOW: "closed",
};

export const queueStatusLabel: Record<QueueStatus, string> = {
  OPEN: "Open",
  PAUSED: "Paused",
  CLOSED: "Closed",
};

export const counterStatusLabel: Record<CounterStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  BREAK: "On break",
  CLOSED: "Closed",
};

export const categoryLabels: Record<ServiceCategory, string> = {
  healthcare: "Healthcare",
  banking: "Banks",
  government: "Government",
  salon: "Salons",
  education: "Education",
  "customer-service": "Customer service",
};

export const serviceStatusLabel: Record<ServiceStatus, string> = {
  open: "Open",
  busy: "Busy",
  closed: "Closed",
};

// ─── Category emoji ───────────────────────────────────────────────────────────
export const categoryIcon: Record<ServiceCategory, string> = {
  healthcare: "🏥",
  banking: "🏦",
  government: "🏛️",
  salon: "✂️",
  education: "🎓",
  "customer-service": "💬",
};
