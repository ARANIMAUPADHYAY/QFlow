export interface DashboardSnapshot {
  label: string;
  capturedAt: string;
  totalCustomersToday: number;
  currentlyWaiting: number;
  currentlyServing: number;
  completedTokens: number;
  averageWaitMinutes: number;
  activeCounters: number;
  totalCounters: number;
}
