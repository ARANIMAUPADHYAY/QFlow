import type {
  QueueToken,
  Counter,
  QueueState,
  Notification,
  Customer,
} from "./queue";
export type {
  QueueToken,
  Counter,
  QueueState,
  Notification,
  Customer,
  TokenStatus,
  CounterStatus,
  QueueStatus,
} from "./queue";
export type { ServiceCentre, ServiceOffering, ServiceCategory, ServiceStatus } from "./centre";
export type { DashboardSnapshot } from "./dashboard";

// App-level state shape exposed from context
export interface AppState {
  queues: Record<string, QueueState>; // keyed by centreId
  myTokenIds: string[]; // tokens the current session joined
  notifications: Notification[];
  customer: Customer | null;
  allTokens: Record<string, QueueToken>; // flat lookup by token id
}

export type AppAction =
  | { type: "JOIN_QUEUE"; token: QueueToken }
  | { type: "CALL_NEXT"; centreId: string; counterId: string }
  | { type: "MARK_SERVING"; centreId: string; tokenId: string; counterId: string }
  | { type: "COMPLETE_SERVICE"; centreId: string; tokenId: string }
  | { type: "SKIP_TOKEN"; centreId: string; tokenId: string }
  | { type: "RECALL_TOKEN"; centreId: string; tokenId: string }
  | { type: "CANCEL_TOKEN"; centreId: string; tokenId: string }
  | { type: "PAUSE_QUEUE"; centreId: string; reason?: string }
  | { type: "RESUME_QUEUE"; centreId: string }
  | { type: "CLOSE_QUEUE"; centreId: string }
  | { type: "REOPEN_QUEUE"; centreId: string }
  | { type: "TOGGLE_COUNTER"; centreId: string; counterId: string }
  | { type: "ASSIGN_STAFF"; centreId: string; counterId: string; staffName: string }
  | { type: "ADD_NOTIFICATION"; notification: Notification }
  | { type: "MARK_NOTIFICATION_READ"; notificationId: string }
  | { type: "MARK_ALL_READ" }
  | { type: "SET_CUSTOMER"; customer: Customer }
  | { type: "TRANSFER_TOKEN"; centreId: string; tokenId: string; toCounterId: string };
