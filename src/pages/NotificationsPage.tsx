import { Link } from "react-router-dom";
import { Bell, BellOff, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/Shared";
import { useQueue } from "../context/QueueContext";
import { formatTimeAgo } from "../utils/format";
import type { Notification } from "../types/queue";

const typeIcon: Record<Notification["type"], string> = {
  JOINED: "🎫",
  APPROACHING: "⏱️",
  CALLED: "🔔",
  SERVING: "✅",
  COMPLETED: "🎉",
  QUEUE_PAUSED: "⏸️",
  QUEUE_RESUMED: "▶️",
  WAIT_UPDATED: "🕐",
  SKIPPED: "⏭️",
};

export function NotificationsPage() {
  const { state, dispatch } = useQueue();
  const { notifications } = state;
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Notifications</h1>
          {unread > 0 && (
            <p className="mt-1 text-sm text-ink-soft">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <Button
            variant="secondary"
            onClick={() => dispatch({ type: "MARK_ALL_READ" })}
            className="gap-2 text-sm"
          >
            <Check size={15} aria-hidden />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<BellOff size={40} className="text-olive" />}
          title="No notifications yet"
          message="Updates about your queue position will appear here."
        />
      ) : (
        <div className="mt-6 space-y-2">
          <AnimatePresence initial={false}>
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 rounded-2xl p-4 ring-1 transition ${
                  n.read ? "bg-card ring-line/60" : "bg-mustard/10 ring-mustard/30"
                }`}
              >
                <span className="mt-0.5 text-xl" aria-hidden>{typeIcon[n.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${n.read ? "text-ink-soft" : "text-ink"}`}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-mustard" aria-label="Unread" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-ink-soft">{n.message}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs text-olive">{formatTimeAgo(n.createdAt)}</span>
                    {n.tokenId && (
                      <Link
                        to={`/token/${n.tokenId}`}
                        className="text-xs font-medium text-sage-deep hover:underline"
                        onClick={() => dispatch({ type: "MARK_NOTIFICATION_READ", notificationId: n.id })}
                      >
                        View token →
                      </Link>
                    )}
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "MARK_NOTIFICATION_READ", notificationId: n.id })}
                        className="text-xs text-olive hover:text-ink"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Container>
  );
}
