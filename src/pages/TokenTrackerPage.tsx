import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bell, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Button, ButtonLink } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { EmptyState, QueueStatusPill } from "../components/ui/Shared";
import { ConfirmDialog } from "../components/ui/Shared";
import { WaitingRoom } from "../features/waitingRoom/WaitingRoom";
import { useQueue } from "../context/QueueContext";
import { useToast } from "../context/ToastContext";
import { getCentre } from "../services/mock/centres";
import {
  formatWait,
  formatTime,
  peopleLabel,
  tokenStatusLabel,
  tokenStatusTone,
} from "../utils/format";
import type { TokenStatus } from "../types/queue";

// Map queue token status to waiting-room character set
const ACTIVE_STATUSES: TokenStatus[] = ["WAITING", "APPROACHING", "CALLED", "SERVING"];

export function TokenTrackerPage() {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useQueue();
  const toast = useToast();
  const [showCancel, setShowCancel] = useState(false);

  const token = tokenId ? state.allTokens[tokenId] : undefined;
  const centre = token ? getCentre(token.centreId) : undefined;
  const service = centre?.services.find((s) => s.id === token?.serviceId);
  const queue = token ? state.queues[token.centreId] : undefined;

  if (!token || !centre || !service) {
    return (
      <Container className="py-20">
        <EmptyState
          icon="🎫"
          title="Token not found"
          message="This token doesn't exist or may have expired."
          action={<ButtonLink to="/centres" variant="secondary">Find a centre</ButtonLink>}
        />
      </Container>
    );
  }

  const isTerminal = ["COMPLETED", "CANCELLED", "NO_SHOW", "SKIPPED"].includes(token.status);
  const isMine = state.myTokenIds.includes(token.id);

  // Build waiting-room occupants from active queue tokens
  const activeTokens = (queue?.tokens ?? []).filter((t) =>
    ACTIVE_STATUSES.includes(t.status),
  );

  const occupants = activeTokens.map((t, idx) => ({
    id: t.id,
    tokenLabel: t.tokenNumber,
    status: t.status,
    isMyToken: t.id === token.id,
    colorIndex: idx,
  }));

  // Currently serving token
  const servingToken = (queue?.tokens ?? []).find((t) => t.status === "SERVING" || t.status === "CALLED");

  // Position in active queue
  const myPosition = activeTokens.findIndex((t) => t.id === token.id) + 1;
  const peopleAhead = Math.max(0, myPosition - 1);

  function handleCancel() {
    dispatch({ type: "CANCEL_TOKEN", centreId: token!.centreId, tokenId: token!.id });
    toast.info("Token cancelled", `${token!.tokenNumber} has been removed from the queue.`);
    setShowCancel(false);
    navigate(`/centres/${token!.centreId}`);
  }

  const statusColors: Record<string, string> = {
    WAITING: "text-ink-soft",
    APPROACHING: "text-mustard",
    CALLED: "text-sage-deep",
    SERVING: "text-sage-deep",
    COMPLETED: "text-olive",
    CANCELLED: "text-olive",
    SKIPPED: "text-olive",
    NO_SHOW: "text-olive",
  };

  return (
    <Container className="py-10">
      <Link
        to={`/centres/${centre.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={15} aria-hidden /> {centre.name}
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        {/* ── Left: Token details ── */}
        <div className="space-y-4">
          {/* Token card */}
          <motion.div
            className="rounded-3xl bg-sage-deep p-7 text-paper shadow-soft"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs font-medium tracking-widest opacity-70">{service.name.toUpperCase()}</p>
            <p className="mt-2 font-display text-7xl">{token.tokenNumber}</p>
            <p className="mt-2 text-sm opacity-80">{centre.name}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-sm font-medium ${statusColors[token.status] ?? "text-paper"}`}>
                {tokenStatusLabel[token.status as TokenStatus]}
              </span>
              {queue && (
                <QueueStatusPill status={queue.status} />
              )}
            </div>
          </motion.div>

          {/* Stats */}
          {!isTerminal && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-card p-4 ring-1 ring-line">
                <p className="text-xs text-olive">People ahead</p>
                <p className="mt-1 font-display text-3xl text-ink">{peopleAhead}</p>
              </div>
              <div className="rounded-2xl bg-card p-4 ring-1 ring-line">
                <p className="text-xs text-olive">Est. wait</p>
                <p className="mt-1 font-display text-2xl text-ink">{formatWait(token.estimatedWaitMinutes)}</p>
              </div>
              <div className="col-span-2 rounded-2xl bg-card p-4 ring-1 ring-line">
                <p className="text-xs text-olive">Currently serving</p>
                <p className="mt-1 font-display text-2xl text-ink">
                  {servingToken?.tokenNumber ?? "—"}
                </p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {!isTerminal && queue && (
            <div>
              <div className="mb-1 flex justify-between text-xs text-olive">
                <span>Queue progress</span>
                <span>{peopleLabel(peopleAhead)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <motion.div
                  className="h-full rounded-full bg-sage-deep"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, Math.max(5, ((activeTokens.length - peopleAhead) / Math.max(1, activeTokens.length)) * 100))}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-2xl bg-card p-4 ring-1 ring-line">
            <p className="mb-3 text-xs font-medium text-olive">Timeline</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-soft">Joined</span>
                <span className="font-medium text-ink">{formatTime(token.joinedAt)}</span>
              </div>
              {token.calledAt && (
                <div className="flex justify-between">
                  <span className="text-ink-soft">Called</span>
                  <span className="font-medium text-sage-deep">{formatTime(token.calledAt)}</span>
                </div>
              )}
              {token.servedAt && (
                <div className="flex justify-between">
                  <span className="text-ink-soft">Serving started</span>
                  <span className="font-medium text-ink">{formatTime(token.servedAt)}</span>
                </div>
              )}
              {token.completedAt && (
                <div className="flex justify-between">
                  <span className="text-ink-soft">Completed</span>
                  <span className="font-medium text-ink">{formatTime(token.completedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Called notice */}
          <AnimatePresence>
            {(token.status === "CALLED" || token.status === "APPROACHING") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl bg-mustard/20 px-4 py-4 ring-2 ring-mustard text-center"
              >
                <Bell size={24} className="mx-auto text-mustard" />
                <p className="mt-2 font-display text-lg text-ink">Your token is called!</p>
                <p className="mt-1 text-sm text-ink-soft">
                  Please proceed to{" "}
                  <span className="font-medium text-ink">
                    {queue?.counters.find((c) => c.id === token.counterId)?.name ?? "the counter"}
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completed notice */}
          {token.status === "COMPLETED" && (
            <div className="rounded-2xl bg-sage/20 px-4 py-4 text-center ring-1 ring-sage">
              <p className="font-display text-lg text-ink">Service complete 🎉</p>
              <p className="mt-1 text-sm text-ink-soft">Thank you for visiting {centre.name}.</p>
            </div>
          )}

          {/* Cancel */}
          {!isTerminal && isMine && (
            <button
              type="button"
              onClick={() => setShowCancel(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-sm text-ink-soft hover:bg-cream hover:text-ink"
            >
              <X size={15} aria-hidden />
              Leave queue
            </button>
          )}

          <ButtonLink to="/history" variant="ghost" className="w-full justify-center text-sm">
            <ExternalLink size={14} aria-hidden /> View queue history
          </ButtonLink>
        </div>

        {/* ── Right: Animated waiting room ── */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-olive">Virtual waiting room</p>
          <WaitingRoom
            occupants={occupants}
            currentToken={servingToken?.tokenNumber}
          />
          <p className="text-center text-xs text-olive">
            {activeTokens.length} {activeTokens.length === 1 ? "person" : "people"} in the room
          </p>
        </div>
      </div>

      <ConfirmDialog
        open={showCancel}
        title="Leave queue?"
        message={`This will cancel token ${token.tokenNumber}. You won't be able to rejoin the same position.`}
        confirmLabel="Leave queue"
        cancelLabel="Stay"
        danger
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
      />
    </Container>
  );
}
