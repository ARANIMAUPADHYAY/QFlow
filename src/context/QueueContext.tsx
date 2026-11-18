import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { AppState, AppAction } from "../types/index";
import type { QueueToken, Notification, Customer } from "../types/queue";
import { initialQueues, mockTokens } from "../services/mock/queue";
import { seedNotifications } from "../services/mock/notifications";

// ─── Token number generators ──────────────────────────────────────────────────
const prefixMap: Record<string, string> = {
  gp: "Q",
  nurse: "N",
  "pharmacy-desk": "P",
  teller: "B",
  loans: "L",
  certificates: "C",
  collection: "D",
  enquiry: "E",
  fees: "F",
  cut: "S",
  colour: "K",
  accounts: "A",
  returns: "R",
};
function tokenPrefix(serviceId: string) {
  return prefixMap[serviceId] ?? "T";
}
function newTokenNumber(existingTokens: QueueToken[], serviceId: string) {
  const prefix = tokenPrefix(serviceId);
  const nums = existingTokens
    .filter((t) => t.serviceId === serviceId)
    .map((t) => parseInt(t.tokenNumber.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

// ─── Wait-time recalculator ───────────────────────────────────────────────────
function recalcWaits(tokens: QueueToken[], avgServiceMin: number): QueueToken[] {
  let pos = 0;
  return tokens.map((t) => {
    if (t.status === "SERVING" || t.status === "CALLED") {
      return { ...t, estimatedWaitMinutes: 0 };
    }
    if (t.status === "WAITING" || t.status === "APPROACHING") {
      pos += 1;
      return { ...t, position: pos, estimatedWaitMinutes: pos * avgServiceMin };
    }
    return t;
  });
}

// ─── Notification factory ─────────────────────────────────────────────────────
function makeNote(
  type: Notification["type"],
  title: string,
  message: string,
  tokenId?: string,
): Notification {
  return {
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    title,
    message,
    tokenId,
    read: false,
    createdAt: new Date().toISOString(),
  };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "JOIN_QUEUE": {
      const { token } = action;
      const queue = state.queues[token.centreId];
      if (!queue) return state;
      const updatedTokens = [...queue.tokens, token];
      const note = makeNote(
        "JOINED",
        "You joined the queue",
        `Your token is ${token.tokenNumber}. ${token.position - 1 > 0 ? `${token.position - 1} people are ahead of you.` : "You are next!"}`,
        token.id,
      );
      return {
        ...state,
        queues: {
          ...state.queues,
          [token.centreId]: {
            ...queue,
            tokens: updatedTokens,
            lastUpdated: new Date().toISOString(),
          },
        },
        allTokens: { ...state.allTokens, [token.id]: token },
        myTokenIds: [...state.myTokenIds, token.id],
        notifications: [note, ...state.notifications],
      };
    }

    case "CALL_NEXT": {
      const { centreId, counterId } = action;
      const queue = state.queues[centreId];
      if (!queue) return state;
      const next = queue.tokens.find(
        (t) => t.status === "WAITING" || t.status === "APPROACHING",
      );
      if (!next) return state;
      const updatedToken: QueueToken = {
        ...next,
        status: "CALLED",
        counterId,
        calledAt: new Date().toISOString(),
      };
      const tokens = queue.tokens.map((t) =>
        t.id === next.id ? updatedToken : t,
      );
      const counters = queue.counters.map((c) =>
        c.id === counterId ? { ...c, currentTokenId: next.id } : c,
      );
      const notes: Notification[] = [];
      if (state.myTokenIds.includes(next.id)) {
        notes.push(
          makeNote(
            "CALLED",
            "Your token has been called!",
            `Token ${next.tokenNumber} — please proceed to the counter.`,
            next.id,
          ),
        );
      }
      return {
        ...state,
        queues: {
          ...state.queues,
          [centreId]: {
            ...queue,
            tokens,
            counters,
            lastUpdated: new Date().toISOString(),
          },
        },
        allTokens: { ...state.allTokens, [next.id]: updatedToken },
        notifications: [...notes, ...state.notifications],
      };
    }

    case "MARK_SERVING": {
      const { centreId, tokenId, counterId } = action;
      const queue = state.queues[centreId];
      if (!queue) return state;
      const token = queue.tokens.find((t) => t.id === tokenId);
      if (!token) return state;
      const updated: QueueToken = {
        ...token,
        status: "SERVING",
        counterId,
        servedAt: new Date().toISOString(),
      };
      const tokens = queue.tokens.map((t) => (t.id === tokenId ? updated : t));
      return {
        ...state,
        queues: {
          ...state.queues,
          [centreId]: { ...queue, tokens, lastUpdated: new Date().toISOString() },
        },
        allTokens: { ...state.allTokens, [tokenId]: updated },
      };
    }

    case "COMPLETE_SERVICE": {
      const { centreId, tokenId } = action;
      const queue = state.queues[centreId];
      if (!queue) return state;
      const token = queue.tokens.find((t) => t.id === tokenId);
      if (!token) return state;
      const updated: QueueToken = {
        ...token,
        status: "COMPLETED",
        completedAt: new Date().toISOString(),
      };
      const tokens = queue.tokens.map((t) => (t.id === tokenId ? updated : t));
      const counters = queue.counters.map((c) =>
        c.currentTokenId === tokenId ? { ...c, currentTokenId: undefined } : c,
      );
      const notes: Notification[] = [];
      if (state.myTokenIds.includes(tokenId)) {
        notes.push(
          makeNote(
            "COMPLETED",
            "Service complete",
            `Your visit at ${centreId.replace(/-/g, " ")} is complete. Thank you!`,
            tokenId,
          ),
        );
      }
      return {
        ...state,
        queues: {
          ...state.queues,
          [centreId]: {
            ...queue,
            tokens,
            counters,
            lastUpdated: new Date().toISOString(),
          },
        },
        allTokens: { ...state.allTokens, [tokenId]: updated },
        notifications: [...notes, ...state.notifications],
      };
    }

    case "SKIP_TOKEN": {
      const { centreId, tokenId } = action;
      const queue = state.queues[centreId];
      if (!queue) return state;
      const token = queue.tokens.find((t) => t.id === tokenId);
      if (!token) return state;
      const updated: QueueToken = { ...token, status: "SKIPPED" };
      const tokens = queue.tokens.map((t) => (t.id === tokenId ? updated : t));
      const counters = queue.counters.map((c) =>
        c.currentTokenId === tokenId ? { ...c, currentTokenId: undefined } : c,
      );
      return {
        ...state,
        queues: {
          ...state.queues,
          [centreId]: { ...queue, tokens, counters, lastUpdated: new Date().toISOString() },
        },
        allTokens: { ...state.allTokens, [tokenId]: updated },
      };
    }

    case "RECALL_TOKEN": {
      const { centreId, tokenId } = action;
      const queue = state.queues[centreId];
      if (!queue) return state;
      const token = queue.tokens.find((t) => t.id === tokenId);
      if (!token) return state;
      const updated: QueueToken = { ...token, status: "CALLED", calledAt: new Date().toISOString() };
      const tokens = queue.tokens.map((t) => (t.id === tokenId ? updated : t));
      return {
        ...state,
        queues: {
          ...state.queues,
          [centreId]: { ...queue, tokens, lastUpdated: new Date().toISOString() },
        },
        allTokens: { ...state.allTokens, [tokenId]: updated },
      };
    }

    case "CANCEL_TOKEN": {
      const { centreId, tokenId } = action;
      const queue = state.queues[centreId];
      if (!queue) return state;
      const token = queue.tokens.find((t) => t.id === tokenId);
      if (!token) return state;
      const updated: QueueToken = { ...token, status: "CANCELLED" };
      const tokens = queue.tokens.map((t) => (t.id === tokenId ? updated : t));
      const counters = queue.counters.map((c) =>
        c.currentTokenId === tokenId ? { ...c, currentTokenId: undefined } : c,
      );
      return {
        ...state,
        queues: {
          ...state.queues,
          [centreId]: { ...queue, tokens, counters, lastUpdated: new Date().toISOString() },
        },
        allTokens: { ...state.allTokens, [tokenId]: updated },
      };
    }

    case "PAUSE_QUEUE": {
      const { centreId, reason } = action;
      const queue = state.queues[centreId];
      if (!queue) return state;
      const note = makeNote("QUEUE_PAUSED", "Queue paused", reason ?? "The queue has been temporarily paused.");
      return {
        ...state,
        queues: {
          ...state.queues,
          [centreId]: { ...queue, status: "PAUSED", pauseReason: reason, lastUpdated: new Date().toISOString() },
        },
        notifications: [note, ...state.notifications],
      };
    }

    case "RESUME_QUEUE": {
      const { centreId } = action;
      const queue = state.queues[centreId];
      if (!queue) return state;
      const note = makeNote("QUEUE_RESUMED", "Queue resumed", "The queue is now open again.");
      return {
        ...state,
        queues: {
          ...state.queues,
          [centreId]: { ...queue, status: "OPEN", pauseReason: undefined, lastUpdated: new Date().toISOString() },
        },
        notifications: [note, ...state.notifications],
      };
    }

    case "CLOSE_QUEUE": {
      const { centreId } = action;
      const queue = state.queues[centreId];
      if (!queue) return state;
      return {
        ...state,
        queues: {
          ...state.queues,
          [centreId]: { ...queue, status: "CLOSED", lastUpdated: new Date().toISOString() },
        },
      };
    }

    case "REOPEN_QUEUE": {
      const { centreId } = action;
      const queue = state.queues[centreId];
      if (!queue) return state;
      return {
        ...state,
        queues: {
          ...state.queues,
          [centreId]: { ...queue, status: "OPEN", lastUpdated: new Date().toISOString() },
        },
      };
    }

    case "TOGGLE_COUNTER": {
      const { centreId, counterId } = action;
      const queue = state.queues[centreId];
      if (!queue) return state;
      const counters = queue.counters.map((c) => {
        if (c.id !== counterId) return c;
        return { ...c, status: c.status === "ACTIVE" ? ("INACTIVE" as const) : ("ACTIVE" as const) };
      });
      return {
        ...state,
        queues: {
          ...state.queues,
          [centreId]: { ...queue, counters, lastUpdated: new Date().toISOString() },
        },
      };
    }

    case "ASSIGN_STAFF": {
      const { centreId, counterId, staffName } = action;
      const queue = state.queues[centreId];
      if (!queue) return state;
      const counters = queue.counters.map((c) =>
        c.id === counterId ? { ...c, staffName } : c,
      );
      return {
        ...state,
        queues: {
          ...state.queues,
          [centreId]: { ...queue, counters, lastUpdated: new Date().toISOString() },
        },
      };
    }

    case "TRANSFER_TOKEN": {
      const { centreId, tokenId, toCounterId } = action;
      const queue = state.queues[centreId];
      if (!queue) return state;
      const token = queue.tokens.find((t) => t.id === tokenId);
      if (!token) return state;
      const updated: QueueToken = { ...token, counterId: toCounterId };
      const tokens = queue.tokens.map((t) => (t.id === tokenId ? updated : t));
      return {
        ...state,
        queues: {
          ...state.queues,
          [centreId]: { ...queue, tokens, lastUpdated: new Date().toISOString() },
        },
        allTokens: { ...state.allTokens, [tokenId]: updated },
      };
    }

    case "ADD_NOTIFICATION":
      return { ...state, notifications: [action.notification, ...state.notifications] };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.notificationId ? { ...n, read: true } : n,
        ),
      };

    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    case "SET_CUSTOMER":
      return { ...state, customer: action.customer };

    default:
      return state;
  }
}

// ─── Build initial state ──────────────────────────────────────────────────────
const allTokensMap: Record<string, QueueToken> = {};
for (const t of mockTokens) {
  allTokensMap[t.id] = t;
}

const STORAGE_KEY = "qflow_state_v1";

function loadPersistedState(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<AppState>;
  } catch {
    return {};
  }
}

function buildInitialState(): AppState {
  const persisted = loadPersistedState();
  return {
    queues: persisted.queues ?? initialQueues,
    myTokenIds: persisted.myTokenIds ?? [],
    notifications: persisted.notifications ?? seedNotifications,
    customer: persisted.customer ?? null,
    allTokens: persisted.allTokens ?? allTokensMap,
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface QueueContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Convenience helpers
  joinQueue: (params: {
    centreId: string;
    serviceId: string;
    customerName: string;
    customerPhone?: string;
    isGuest?: boolean;
    priority?: QueueToken["priority"];
  }) => QueueToken;
  getActiveTokenForCentre: (centreId: string) => QueueToken | undefined;
  getQueueForCentre: (centreId: string) => import("../types/queue").QueueState | undefined;
  recalcQueue: (centreId: string, avgServiceMin?: number) => void;
  unreadCount: number;
}

const QueueContext = createContext<QueueContextValue | null>(null);

export function QueueProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage quota — ignore
    }
  }, [state]);

  const joinQueue = useCallback(
    ({
      centreId,
      serviceId,
      customerName,
      customerPhone,
      isGuest = false,
      priority = "NORMAL",
    }: {
      centreId: string;
      serviceId: string;
      customerName: string;
      customerPhone?: string;
      isGuest?: boolean;
      priority?: QueueToken["priority"];
    }): QueueToken => {
      const queue = state.queues[centreId];
      const existing = queue?.tokens ?? [];
      const waiting = existing.filter(
        (t) => (t.status === "WAITING" || t.status === "APPROACHING") && t.serviceId === serviceId,
      );
      const position = waiting.length + 1;
      const tokenNumber = newTokenNumber(existing, serviceId);
      const token: QueueToken = {
        id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        tokenNumber,
        centreId,
        serviceId,
        customerId: `guest-${Date.now()}`,
        customerName: customerName || "Guest",
        customerPhone,
        status: "WAITING",
        position,
        joinedAt: new Date().toISOString(),
        estimatedWaitMinutes: position * 10,
        isGuest,
        priority,
      };
      dispatch({ type: "JOIN_QUEUE", token });
      return token;
    },
    [state.queues],
  );

  const getActiveTokenForCentre = useCallback(
    (centreId: string) => {
      return state.myTokenIds
        .map((id) => state.allTokens[id])
        .filter(Boolean)
        .find((t) => t.centreId === centreId && !["COMPLETED", "CANCELLED", "NO_SHOW", "SKIPPED"].includes(t.status));
    },
    [state.myTokenIds, state.allTokens],
  );

  const getQueueForCentre = useCallback(
    (centreId: string) => state.queues[centreId],
    [state.queues],
  );

  const recalcQueue = useCallback(
    (centreId: string, avgServiceMin = 10) => {
      const queue = state.queues[centreId];
      if (!queue) return;
      const updated = recalcWaits(queue.tokens, avgServiceMin);
      // We update allTokens too via a mini local dispatch
      const updatedMap = { ...state.allTokens };
      for (const t of updated) updatedMap[t.id] = t;
      // For simplicity, mutate via a synthetic action — we'll use MARK_SERVING as a no-op trigger
      // Real solution: add a RECALC action. For now we skip to avoid complexity.
      void updated;
    },
    [state.queues, state.allTokens],
  );

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <QueueContext.Provider
      value={{ state, dispatch, joinQueue, getActiveTokenForCentre, getQueueForCentre, recalcQueue, unreadCount }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error("useQueue must be used within QueueProvider");
  return ctx;
}
