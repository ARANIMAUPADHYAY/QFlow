// ─── Token & Queue Entry Types ───────────────────────────────────────────────

export type TokenStatus =
  | "WAITING"
  | "APPROACHING"
  | "CALLED"
  | "SERVING"
  | "COMPLETED"
  | "SKIPPED"
  | "CANCELLED"
  | "NO_SHOW";

export type CounterStatus = "ACTIVE" | "INACTIVE" | "BREAK" | "CLOSED";

export type QueueStatus = "OPEN" | "PAUSED" | "CLOSED";

export interface QueueToken {
  id: string;
  tokenNumber: string;
  centreId: string;
  serviceId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  status: TokenStatus;
  counterId?: string;
  position: number;
  joinedAt: string; // ISO timestamp
  calledAt?: string;
  servedAt?: string;
  completedAt?: string;
  estimatedWaitMinutes: number;
  isGuest: boolean;
  priority: "NORMAL" | "PRIORITY";
  notes?: string;
}

export interface Counter {
  id: string;
  centreId: string;
  name: string;
  number: number;
  status: CounterStatus;
  staffName?: string;
  serviceIds: string[];
  currentTokenId?: string;
}

export interface QueueState {
  centreId: string;
  status: QueueStatus;
  tokens: QueueToken[];
  counters: Counter[];
  lastUpdated: string;
  pauseReason?: string;
}

export interface Notification {
  id: string;
  type:
    | "JOINED"
    | "APPROACHING"
    | "CALLED"
    | "SERVING"
    | "COMPLETED"
    | "QUEUE_PAUSED"
    | "QUEUE_RESUMED"
    | "WAIT_UPDATED"
    | "SKIPPED";
  title: string;
  message: string;
  tokenId?: string;
  read: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  isGuest: boolean;
  history: string[]; // token IDs
}
