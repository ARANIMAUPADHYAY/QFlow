import { useState } from "react";
import { UserCheck, Power, User } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { EmptyState } from "../../components/ui/Shared";
import { useQueue } from "../../context/QueueContext";
import { useToast } from "../../context/ToastContext";
import type { Counter } from "../../types/queue";

const DEMO_CENTRE = "cedar-bay-clinic";

const statusTone: Record<Counter["status"], "sage" | "closed" | "mustard"> = {
  ACTIVE: "sage",
  INACTIVE: "closed",
  BREAK: "mustard",
  CLOSED: "closed",
};

export function AdminCountersPage() {
  const { state, dispatch } = useQueue();
  const toast = useToast();
  const [centreId] = useState(DEMO_CENTRE);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [staffInput, setStaffInput] = useState("");

  const queue = state.queues[centreId];
  if (!queue) return <p className="text-ink-soft">No queue data.</p>;

  function toggleCounter(counterId: string) {
    dispatch({ type: "TOGGLE_COUNTER", centreId, counterId });
    toast.info("Counter updated");
  }

  function saveStaff(counterId: string) {
    if (staffInput.trim()) {
      dispatch({ type: "ASSIGN_STAFF", centreId, counterId, staffName: staffInput.trim() });
      toast.success("Staff assigned", staffInput.trim());
    }
    setEditingStaff(null);
    setStaffInput("");
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Counters</h1>
      <p className="mt-1 text-sm text-ink-soft">Manage service counters and staff assignments.</p>

      {queue.counters.length === 0 ? (
        <EmptyState icon="🏪" title="No counters" message="No counters configured for this centre." />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {queue.counters.map((counter) => {
            const servingToken = counter.currentTokenId
              ? queue.tokens.find((t) => t.id === counter.currentTokenId)
              : undefined;
            return (
              <div
                key={counter.id}
                className={`rounded-3xl p-5 ring-1 shadow-soft ${
                  counter.status === "ACTIVE"
                    ? "bg-card ring-sage/40"
                    : "bg-line/30 ring-line opacity-70"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-xl text-ink">
                      Counter {counter.number}
                    </p>
                    <p className="text-sm text-ink-soft">{counter.name}</p>
                  </div>
                  <Badge tone={statusTone[counter.status]}>{counter.status}</Badge>
                </div>

                {/* Staff */}
                <div className="mt-4 flex items-center gap-2">
                  <User size={14} className="text-olive" aria-hidden />
                  {editingStaff === counter.id ? (
                    <div className="flex flex-1 gap-2">
                      <input
                        autoFocus
                        value={staffInput}
                        onChange={(e) => setStaffInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveStaff(counter.id)}
                        placeholder="Staff name"
                        className="flex-1 rounded-xl border border-line bg-paper px-3 py-1.5 text-sm text-ink focus:border-sage-deep focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => saveStaff(counter.id)}
                        className="rounded-full bg-sage-deep px-3 py-1 text-xs text-paper"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setEditingStaff(counter.id); setStaffInput(counter.staffName ?? ""); }}
                      className="text-sm text-ink-soft hover:text-ink"
                    >
                      {counter.staffName ?? "Unassigned — click to assign"}
                    </button>
                  )}
                </div>

                {/* Serving */}
                {servingToken && (
                  <div className="mt-3 rounded-xl bg-sage/15 px-3 py-2">
                    <p className="text-xs text-olive">Now serving</p>
                    <p className="font-display text-lg text-ink">{servingToken.tokenNumber}</p>
                    <p className="text-xs text-ink-soft">{servingToken.customerName}</p>
                  </div>
                )}

                {/* Services */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {counter.serviceIds.map((s) => (
                    <span key={s} className="rounded-full bg-cream px-2 py-0.5 text-xs text-ink-soft capitalize">
                      {s.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>

                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => toggleCounter(counter.id)}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition ${
                    counter.status === "ACTIVE"
                      ? "bg-line/60 text-ink-soft hover:bg-line"
                      : "bg-sage-deep text-paper hover:bg-ink"
                  }`}
                >
                  <Power size={14} aria-hidden />
                  {counter.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
