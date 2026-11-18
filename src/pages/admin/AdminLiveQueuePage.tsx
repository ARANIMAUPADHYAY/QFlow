import { useState } from "react";
import { ChevronDown, ArrowRight, SkipForward, RotateCcw, X, CheckCircle, ArrowRightLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/Shared";
import { EmptyState } from "../../components/ui/Shared";
import { useQueue } from "../../context/QueueContext";
import { useToast } from "../../context/ToastContext";
import { formatTime, formatWait, tokenStatusLabel, tokenStatusTone } from "../../utils/format";
import type { TokenStatus, QueueToken } from "../../types/queue";

const DEMO_CENTRE = "cedar-bay-clinic";

type ActionKey = "call" | "serve" | "complete" | "skip" | "recall" | "cancel" | "transfer";

interface PendingAction {
  key: ActionKey;
  token: QueueToken;
  targetCounterId?: string;
}

export function AdminLiveQueuePage() {
  const { state, dispatch } = useQueue();
  const toast = useToast();
  const [centreId, setCentreId] = useState(DEMO_CENTRE);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [filterStatus, setFilterStatus] = useState<TokenStatus | "ALL">("ALL");

  const queue = state.queues[centreId];
  if (!queue) return <p className="text-ink-soft">No queue data.</p>;

  const counters = queue.counters;
  const activeCounters = counters.filter((c) => c.status === "ACTIVE");

  const allTokens = [...queue.tokens].sort(
    (a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime(),
  );
  const filtered =
    filterStatus === "ALL"
      ? allTokens
      : allTokens.filter((t) => t.status === filterStatus);

  // Determine which counter is free
  const freeCounter = activeCounters.find((c) => !c.currentTokenId);

  function confirm(key: ActionKey, token: QueueToken, targetCounterId?: string) {
    if (key === "call" || key === "skip" || key === "complete" || key === "recall") {
      // Non-destructive or already handled — act immediately except cancel
      execute(key, token, targetCounterId);
    } else {
      setPending({ key, token, targetCounterId });
    }
  }

  function execute(key: ActionKey, token: QueueToken, targetCounterId?: string) {
    switch (key) {
      case "call":
        if (!freeCounter) { toast.warning("No free counter", "All active counters are occupied."); return; }
        dispatch({ type: "CALL_NEXT", centreId, counterId: freeCounter.id });
        toast.success("Token called", `${token.tokenNumber} → ${freeCounter.name}`);
        break;
      case "serve":
        dispatch({ type: "MARK_SERVING", centreId, tokenId: token.id, counterId: token.counterId ?? (freeCounter?.id ?? "") });
        toast.info("Marked serving", token.tokenNumber);
        break;
      case "complete":
        dispatch({ type: "COMPLETE_SERVICE", centreId, tokenId: token.id });
        toast.success("Service complete", token.tokenNumber);
        break;
      case "skip":
        dispatch({ type: "SKIP_TOKEN", centreId, tokenId: token.id });
        toast.warning("Token skipped", token.tokenNumber);
        break;
      case "recall":
        dispatch({ type: "RECALL_TOKEN", centreId, tokenId: token.id });
        toast.info("Token recalled", token.tokenNumber);
        break;
      case "cancel":
        dispatch({ type: "CANCEL_TOKEN", centreId, tokenId: token.id });
        toast.info("Token cancelled", token.tokenNumber);
        break;
      case "transfer":
        if (targetCounterId) {
          dispatch({ type: "TRANSFER_TOKEN", centreId, tokenId: token.id, toCounterId: targetCounterId });
          toast.info("Token transferred", token.tokenNumber);
        }
        break;
    }
    setPending(null);
  }

  const statuses: Array<TokenStatus | "ALL"> = ["ALL", "WAITING", "CALLED", "SERVING", "COMPLETED", "SKIPPED", "CANCELLED"];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Live queue</h1>
          <p className="mt-1 text-sm text-ink-soft">Manage tokens in real time.</p>
        </div>
        {/* Centre selector */}
        <div className="relative">
          <select
            value={centreId}
            onChange={(e) => setCentreId(e.target.value)}
            className="appearance-none rounded-full border border-line bg-card px-4 py-2 pr-8 text-sm text-ink focus:border-sage-deep focus:outline-none"
          >
            {Object.keys(state.queues).map((id) => (
              <option key={id} value={id}>{id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-olive" />
        </div>
      </div>

      {/* Call next */}
      {freeCounter && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-sage/10 px-4 py-3 ring-1 ring-sage">
          <p className="text-sm text-ink-soft flex-1">
            <span className="font-medium text-ink">{freeCounter.name}</span> is free
          </p>
          <Button
            onClick={() => {
              const next = allTokens.find((t) => t.status === "WAITING" || t.status === "APPROACHING");
              if (next) confirm("call", next);
              else toast.info("Queue empty", "No waiting customers.");
            }}
          >
            <ArrowRight size={15} aria-hidden /> Call next
          </Button>
        </div>
      )}

      {/* Status filter */}
      <div className="mt-5 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilterStatus(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filterStatus === s ? "bg-sage-deep text-paper" : "bg-card text-ink ring-1 ring-line hover:bg-cream"
            }`}
          >
            {s === "ALL" ? "All" : tokenStatusLabel[s]}
          </button>
        ))}
      </div>

      {/* Token table */}
      <div className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState icon="🎫" title="No tokens" message="No tokens match this filter." />
        ) : (
          <div className="overflow-x-auto rounded-2xl ring-1 ring-line">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-cream/60 text-left text-xs font-medium text-olive">
                <tr>
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Wait</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Counter</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <AnimatePresence initial={false}>
                  {filtered.map((token) => {
                    const counter = counters.find((c) => c.id === token.counterId);
                    return (
                      <motion.tr
                        key={token.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-card"
                      >
                        <td className="px-4 py-3 font-display text-lg text-ink">{token.tokenNumber}</td>
                        <td className="px-4 py-3 text-ink">{token.customerName}{token.isGuest && <span className="ml-1 text-xs text-olive">(guest)</span>}</td>
                        <td className="px-4 py-3 text-ink-soft capitalize">{token.serviceId.replace(/-/g, " ")}</td>
                        <td className="px-4 py-3 text-ink-soft">{formatTime(token.joinedAt)}</td>
                        <td className="px-4 py-3 text-ink">{formatWait(token.estimatedWaitMinutes)}</td>
                        <td className="px-4 py-3">
                          <Badge tone={tokenStatusTone[token.status as TokenStatus]}>
                            {tokenStatusLabel[token.status as TokenStatus]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-ink-soft">{counter?.name ?? "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {token.status === "WAITING" && (
                              <>
                                <ActionBtn icon={<ArrowRight size={13} />} label="Call" onClick={() => confirm("call", token)} />
                                <ActionBtn icon={<SkipForward size={13} />} label="Skip" danger onClick={() => setPending({ key: "skip", token })} />
                              </>
                            )}
                            {token.status === "CALLED" && (
                              <>
                                <ActionBtn icon={<CheckCircle size={13} />} label="Serving" onClick={() => confirm("serve", token)} />
                                <ActionBtn icon={<RotateCcw size={13} />} label="Recall" onClick={() => confirm("recall", token)} />
                              </>
                            )}
                            {token.status === "SERVING" && (
                              <ActionBtn icon={<CheckCircle size={13} />} label="Complete" onClick={() => setPending({ key: "complete", token })} />
                            )}
                            {token.status === "SKIPPED" && (
                              <ActionBtn icon={<RotateCcw size={13} />} label="Recall" onClick={() => confirm("recall", token)} />
                            )}
                            {(token.status === "WAITING" || token.status === "CALLED") && (
                              <ActionBtn icon={<X size={13} />} label="Cancel" danger onClick={() => setPending({ key: "cancel", token })} />
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={pending !== null}
        title={
          pending?.key === "cancel" ? "Cancel token?" :
          pending?.key === "complete" ? "Mark as complete?" :
          pending?.key === "skip" ? "Skip token?" :
          pending?.key === "transfer" ? "Transfer token?" :
          "Confirm action"
        }
        message={
          pending?.key === "cancel"
            ? `This will remove ${pending.token.tokenNumber} from the queue.`
            : pending?.key === "skip"
            ? `${pending.token.tokenNumber} will be moved to the end.`
            : `Confirm action for ${pending?.token.tokenNumber}.`
        }
        confirmLabel={
          pending?.key === "cancel" ? "Cancel token" :
          pending?.key === "complete" ? "Complete" :
          pending?.key === "skip" ? "Skip" :
          "Confirm"
        }
        danger={pending?.key === "cancel" || pending?.key === "skip"}
        onConfirm={() => pending && execute(pending.key, pending.token, pending.targetCounterId)}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition ${
        danger
          ? "bg-red-50 text-red-700 hover:bg-red-100"
          : "bg-sage/20 text-sage-deep hover:bg-sage/40"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
