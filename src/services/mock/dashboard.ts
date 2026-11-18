import type { DashboardSnapshot } from "../../types/dashboard";

/** Sample figures for the staff layout. Live totals arrive with queue tools. */
export const sampleDashboard: DashboardSnapshot = {
  label: "Sample day",
  capturedAt: "Today, 10:40",
  totalCustomersToday: 86,
  currentlyWaiting: 14,
  currentlyServing: 3,
  completedTokens: 61,
  averageWaitMinutes: 18,
  activeCounters: 3,
  totalCounters: 4,
};
