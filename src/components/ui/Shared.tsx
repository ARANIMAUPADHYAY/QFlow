import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-3xl bg-card p-6 shadow-soft ring-1 ring-line"
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="font-display text-xl text-ink">{title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{message}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft hover:bg-cream"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  danger
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-sage-deep text-paper hover:bg-ink"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Status dot ──────────────────────────────────────────────────────────────
export function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${active ? "bg-sage-deep" : "bg-olive/40"}`}
      aria-hidden
    />
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      {icon && <div className="text-4xl">{icon}</div>}
      <p className="font-display text-xl text-ink">{title}</p>
      {message && <p className="max-w-xs text-sm text-ink-soft">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
export function SectionHeading({
  label,
  title,
  subtitle,
}: {
  label?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      {label && <p className="mb-2 text-sm font-medium tracking-wide text-olive">{label}</p>}
      <h2 className="font-display text-3xl text-ink sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-7 text-ink-soft">{subtitle}</p>}
    </div>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 60" />
    </svg>
  );
}

// ─── Queue status pill ────────────────────────────────────────────────────────
export function QueueStatusPill({ status }: { status: "OPEN" | "PAUSED" | "CLOSED" }) {
  const styles = {
    OPEN: "bg-sage/70 text-ink",
    PAUSED: "bg-mustard/80 text-ink",
    CLOSED: "bg-line text-ink-soft",
  };
  const labels = { OPEN: "Open", PAUSED: "Paused", CLOSED: "Closed" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      <StatusDot active={status === "OPEN"} />
      {labels[status]}
    </span>
  );
}
