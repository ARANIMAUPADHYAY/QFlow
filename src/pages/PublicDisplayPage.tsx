import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueue } from "../context/QueueContext";
import { WaitingRoom } from "../features/waitingRoom/WaitingRoom";
import { QueueStatusPill } from "../components/ui/Shared";
import { formatTime } from "../utils/format";
import type { TokenStatus } from "../types/queue";

const DEMO_CENTRE = "cedar-bay-clinic";
const ACTIVE_STATUSES: TokenStatus[] = ["WAITING", "APPROACHING", "CALLED", "SERVING"];

export function PublicDisplayPage() {
  const { state } = useQueue();
  const [tick, setTick] = useState(new Date());

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setTick(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const queue = state.queues[DEMO_CENTRE];
  const tokens = queue?.tokens ?? [];

  const serving = tokens.filter((t) => t.status === "SERVING" || t.status === "CALLED");
  const nextUp = tokens
    .filter((t) => t.status === "WAITING" || t.status === "APPROACHING")
    .sort((a, b) => a.position - b.position)
    .slice(0, 5);
  const recentlyDone = Object.values(state.allTokens)
    .filter((t) => t.centreId === DEMO_CENTRE && t.status === "COMPLETED")
    .sort((a, b) => new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime())
    .slice(0, 4);

  const activeTokens = tokens.filter((t) => ACTIVE_STATUSES.includes(t.status));
  const occupants = activeTokens.map((t, idx) => ({
    id: t.id,
    tokenLabel: t.tokenNumber,
    status: t.status,
    isMyToken: false,
    colorIndex: idx,
  }));

  const currentServingToken = serving[0];

  return (
    <div className="min-h-svh bg-paper text-ink flex flex-col">
      {/* ── Top bar ── */}
      <header className="flex items-center justify-between border-b border-line bg-sage-deep px-8 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-paper text-sage-deep text-lg font-bold">Q</span>
          <div>
            <p className="font-display text-xl text-paper">QFlow</p>
            <p className="text-xs text-sage/80">Cedar Bay Clinic — Public Display</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {queue && <QueueStatusPill status={queue.status} />}
          <p className="font-display text-2xl text-paper tabular-nums">
            {tick.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        </div>
      </header>

      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* ── Left: Token info ── */}
        <div className="flex w-72 shrink-0 flex-col gap-4 border-r border-line p-6 lg:w-96">
          {/* Now serving */}
          <div>
            <p className="text-xs font-medium tracking-widest text-olive">NOW SERVING</p>
            <AnimatePresence mode="wait">
              {serving.length > 0 ? (
                serving.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-3"
                  >
                    <p className="font-display text-7xl text-ink leading-none">{t.tokenNumber}</p>
                    <p className="mt-2 text-sm text-ink-soft">
                      {queue?.counters.find((c) => c.id === t.counterId)?.name ?? "Counter —"} ·{" "}
                      {queue?.counters.find((c) => c.id === t.counterId)?.staffName ?? ""}
                    </p>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  key="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 font-display text-4xl text-ink-soft"
                >
                  —
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-line" />

          {/* Next up */}
          <div>
            <p className="text-xs font-medium tracking-widest text-olive">NEXT UP</p>
            <div className="mt-3 space-y-2">
              <AnimatePresence>
                {nextUp.length === 0 && (
                  <p className="text-sm text-ink-soft">Queue is clear.</p>
                )}
                {nextUp.map((t, i) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${
                      i === 0 ? "bg-mustard/20 ring-1 ring-mustard/40" : "bg-cream/60"
                    }`}
                  >
                    <span className="font-display text-xl text-ink">{t.tokenNumber}</span>
                    <span className="text-xs text-ink-soft">
                      {i === 0 ? "Next" : `#${i + 1}`}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="border-t border-line" />

          {/* Recently done */}
          <div>
            <p className="text-xs font-medium tracking-widest text-olive">RECENTLY COMPLETED</p>
            <div className="mt-3 space-y-1.5">
              {recentlyDone.length === 0 && (
                <p className="text-sm text-ink-soft">None yet.</p>
              )}
              {recentlyDone.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <span className="font-display text-lg text-ink-soft line-through">{t.tokenNumber}</span>
                  <span className="text-xs text-olive">
                    {t.completedAt ? formatTime(t.completedAt) : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Queue stats */}
          <div className="mt-auto rounded-2xl bg-sage/10 px-4 py-3">
            <p className="text-xs text-olive">In room right now</p>
            <p className="mt-1 font-display text-3xl text-ink">{activeTokens.length}</p>
          </div>
        </div>

        {/* ── Right: Animated waiting room ── */}
        <div className="flex flex-1 flex-col p-6">
          <p className="mb-3 text-xs font-medium tracking-widest text-olive">VIRTUAL WAITING ROOM</p>
          <div className="flex-1">
            <WaitingRoom
              occupants={occupants}
              currentToken={currentServingToken?.tokenNumber}
            />
          </div>
          <p className="mt-3 text-center text-xs text-olive">
            Please listen for your token number and proceed to the indicated counter when called.
          </p>
        </div>
      </div>
    </div>
  );
}
