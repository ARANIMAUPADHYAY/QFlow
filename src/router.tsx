import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import { MarketingLayout } from "./components/layout/MarketingLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

// Customer pages
import { LandingPage } from "./pages/LandingPage";
import { CentresPage } from "./pages/CentresPage";
import { CentreDetailPage } from "./pages/CentreDetailPage";
import { JoinQueuePage } from "./pages/JoinQueuePage";
import { TokenTrackerPage } from "./pages/TokenTrackerPage";
import { HistoryPage } from "./pages/HistoryPage";
import { NotificationsPage } from "./pages/NotificationsPage";

// Admin pages
import { AdminOverviewPage } from "./pages/admin/AdminOverviewPage";
import { AdminLiveQueuePage } from "./pages/admin/AdminLiveQueuePage";
import { AdminCountersPage } from "./pages/admin/AdminCountersPage";
import { AdminServicesPage } from "./pages/admin/AdminServicesPage";
import { AdminQueueControlsPage } from "./pages/admin/AdminQueueControlsPage";

// Public display
import { PublicDisplayPage } from "./pages/PublicDisplayPage";

// 404
import { NotFoundPage } from "./pages/NotFoundPage";

const router = createBrowserRouter([
  // ── Customer / marketing routes ──────────────────────────────────────────
  {
    element: <MarketingLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/centres", element: <CentresPage /> },
      { path: "/centres/:id", element: <CentreDetailPage /> },
      { path: "/centres/:id/join", element: <JoinQueuePage /> },
      { path: "/token/:tokenId", element: <TokenTrackerPage /> },
      { path: "/history", element: <HistoryPage /> },
      { path: "/notifications", element: <NotificationsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  // ── Admin routes ─────────────────────────────────────────────────────────
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminOverviewPage /> },
      { path: "queue", element: <AdminLiveQueuePage /> },
      { path: "counters", element: <AdminCountersPage /> },
      { path: "services", element: <AdminServicesPage /> },
      { path: "controls", element: <AdminQueueControlsPage /> },
    ],
  },

  // ── Public display (standalone, no layout) ───────────────────────────────
  { path: "/display", element: <PublicDisplayPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
