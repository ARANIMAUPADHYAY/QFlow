import type { QueueToken, Counter, QueueState } from "../../types/queue";

// ─── Counters per centre ──────────────────────────────────────────────────────

export const mockCounters: Record<string, Counter[]> = {
  "cedar-bay-clinic": [
    {
      id: "cbc-c1",
      centreId: "cedar-bay-clinic",
      name: "Counter 1",
      number: 1,
      status: "ACTIVE",
      staffName: "Dr. Priya R.",
      serviceIds: ["gp"],
      currentTokenId: undefined,
    },
    {
      id: "cbc-c2",
      centreId: "cedar-bay-clinic",
      name: "Counter 2",
      number: 2,
      status: "ACTIVE",
      staffName: "Nurse Amir",
      serviceIds: ["nurse"],
      currentTokenId: undefined,
    },
    {
      id: "cbc-c3",
      centreId: "cedar-bay-clinic",
      name: "Counter 3",
      number: 3,
      status: "ACTIVE",
      staffName: "Receptionist",
      serviceIds: ["pharmacy-desk"],
      currentTokenId: undefined,
    },
    {
      id: "cbc-c4",
      centreId: "cedar-bay-clinic",
      name: "Counter 4",
      number: 4,
      status: "INACTIVE",
      serviceIds: ["gp", "nurse"],
    },
  ],
  "northwharf-bank": [
    {
      id: "nwb-c1",
      centreId: "northwharf-bank",
      name: "Teller 1",
      number: 1,
      status: "ACTIVE",
      staffName: "James O.",
      serviceIds: ["teller"],
    },
    {
      id: "nwb-c2",
      centreId: "northwharf-bank",
      name: "Teller 2",
      number: 2,
      status: "ACTIVE",
      staffName: "Sophie L.",
      serviceIds: ["teller"],
    },
    {
      id: "nwb-c3",
      centreId: "northwharf-bank",
      name: "Loans",
      number: 3,
      status: "ACTIVE",
      staffName: "Mr. Nair",
      serviceIds: ["loans"],
    },
  ],
  "civic-records": [
    {
      id: "cr-c1",
      centreId: "civic-records",
      name: "Window 1",
      number: 1,
      status: "ACTIVE",
      staffName: "Officer Kim",
      serviceIds: ["certificates", "collection"],
    },
    {
      id: "cr-c2",
      centreId: "civic-records",
      name: "Window 2",
      number: 2,
      status: "ACTIVE",
      staffName: "Officer Santos",
      serviceIds: ["certificates"],
    },
    {
      id: "cr-c3",
      centreId: "civic-records",
      name: "Window 3",
      number: 3,
      status: "BREAK",
      serviceIds: ["collection"],
    },
  ],
};

// ─── Seed tokens ─────────────────────────────────────────────────────────────

function makeToken(overrides: Partial<QueueToken> & Pick<QueueToken, "id" | "tokenNumber" | "centreId" | "serviceId" | "customerId" | "customerName" | "position" | "joinedAt">): QueueToken {
  return {
    status: "WAITING",
    isGuest: false,
    priority: "NORMAL",
    estimatedWaitMinutes: overrides.position * 10,
    ...overrides,
  };
}

const NOW = new Date();
function minsAgo(n: number) {
  return new Date(NOW.getTime() - n * 60000).toISOString();
}

export const mockTokens: QueueToken[] = [
  // Cedar Bay Clinic — GP queue (9 people)
  makeToken({ id: "t-001", tokenNumber: "Q001", centreId: "cedar-bay-clinic", serviceId: "gp", customerId: "c-001", customerName: "Alex M.", position: 1, joinedAt: minsAgo(60), status: "SERVING", counterId: "cbc-c1", calledAt: minsAgo(5), servedAt: minsAgo(3), estimatedWaitMinutes: 0 }),
  makeToken({ id: "t-002", tokenNumber: "Q002", centreId: "cedar-bay-clinic", serviceId: "gp", customerId: "c-002", customerName: "Preethi V.", position: 2, joinedAt: minsAgo(55), estimatedWaitMinutes: 12 }),
  makeToken({ id: "t-003", tokenNumber: "Q003", centreId: "cedar-bay-clinic", serviceId: "gp", customerId: "c-003", customerName: "Guest", position: 3, joinedAt: minsAgo(50), isGuest: true, estimatedWaitMinutes: 24 }),
  makeToken({ id: "t-004", tokenNumber: "Q004", centreId: "cedar-bay-clinic", serviceId: "gp", customerId: "c-004", customerName: "Robert K.", position: 4, joinedAt: minsAgo(45), estimatedWaitMinutes: 36 }),
  makeToken({ id: "t-005", tokenNumber: "Q005", centreId: "cedar-bay-clinic", serviceId: "gp", customerId: "c-005", customerName: "Lena H.", position: 5, joinedAt: minsAgo(40), estimatedWaitMinutes: 48 }),
  makeToken({ id: "t-006", tokenNumber: "Q006", centreId: "cedar-bay-clinic", serviceId: "gp", customerId: "c-006", customerName: "Guest", position: 6, joinedAt: minsAgo(30), isGuest: true, estimatedWaitMinutes: 60 }),
  makeToken({ id: "t-007", tokenNumber: "Q007", centreId: "cedar-bay-clinic", serviceId: "gp", customerId: "c-007", customerName: "Michael T.", position: 7, joinedAt: minsAgo(25), estimatedWaitMinutes: 72 }),
  makeToken({ id: "t-008", tokenNumber: "Q008", centreId: "cedar-bay-clinic", serviceId: "gp", customerId: "c-008", customerName: "Sara N.", position: 8, joinedAt: minsAgo(20), estimatedWaitMinutes: 84 }),
  makeToken({ id: "t-009", tokenNumber: "Q009", centreId: "cedar-bay-clinic", serviceId: "gp", customerId: "c-009", customerName: "David C.", position: 9, joinedAt: minsAgo(15), estimatedWaitMinutes: 96 }),
  // Cedar Bay Clinic — Nurse
  makeToken({ id: "t-010", tokenNumber: "N001", centreId: "cedar-bay-clinic", serviceId: "nurse", customerId: "c-010", customerName: "Fatima A.", position: 1, joinedAt: minsAgo(35), status: "SERVING", counterId: "cbc-c2", calledAt: minsAgo(4), servedAt: minsAgo(2), estimatedWaitMinutes: 0 }),
  makeToken({ id: "t-011", tokenNumber: "N002", centreId: "cedar-bay-clinic", serviceId: "nurse", customerId: "c-011", customerName: "Guest", position: 2, joinedAt: minsAgo(28), isGuest: true, estimatedWaitMinutes: 8 }),
  makeToken({ id: "t-012", tokenNumber: "N003", centreId: "cedar-bay-clinic", serviceId: "nurse", customerId: "c-012", customerName: "John B.", position: 3, joinedAt: minsAgo(20), estimatedWaitMinutes: 16 }),
  makeToken({ id: "t-013", tokenNumber: "N004", centreId: "cedar-bay-clinic", serviceId: "nurse", customerId: "c-013", customerName: "Ana L.", position: 4, joinedAt: minsAgo(10), estimatedWaitMinutes: 24 }),
  // Cedar Bay Clinic — Pharmacy (2 people)
  makeToken({ id: "t-014", tokenNumber: "P001", centreId: "cedar-bay-clinic", serviceId: "pharmacy-desk", customerId: "c-014", customerName: "Wei Z.", position: 1, joinedAt: minsAgo(18), estimatedWaitMinutes: 5 }),
  makeToken({ id: "t-015", tokenNumber: "P002", centreId: "cedar-bay-clinic", serviceId: "pharmacy-desk", customerId: "c-015", customerName: "Guest", position: 2, joinedAt: minsAgo(10), isGuest: true, estimatedWaitMinutes: 10 }),
  // Northwharf Bank — Teller
  makeToken({ id: "t-020", tokenNumber: "B001", centreId: "northwharf-bank", serviceId: "teller", customerId: "c-020", customerName: "Guest", position: 1, joinedAt: minsAgo(70), status: "SERVING", counterId: "nwb-c1", calledAt: minsAgo(6), servedAt: minsAgo(4), estimatedWaitMinutes: 0, isGuest: true }),
  makeToken({ id: "t-021", tokenNumber: "B002", centreId: "northwharf-bank", serviceId: "teller", customerId: "c-021", customerName: "Chen W.", position: 2, joinedAt: minsAgo(60), estimatedWaitMinutes: 7 }),
  makeToken({ id: "t-022", tokenNumber: "B003", centreId: "northwharf-bank", serviceId: "teller", customerId: "c-022", customerName: "Guest", position: 3, joinedAt: minsAgo(50), isGuest: true, estimatedWaitMinutes: 14 }),
  makeToken({ id: "t-023", tokenNumber: "B004", centreId: "northwharf-bank", serviceId: "teller", customerId: "c-023", customerName: "Riya P.", position: 4, joinedAt: minsAgo(40), estimatedWaitMinutes: 21 }),
  makeToken({ id: "t-024", tokenNumber: "B005", centreId: "northwharf-bank", serviceId: "teller", customerId: "c-024", customerName: "Guest", position: 5, joinedAt: minsAgo(30), isGuest: true, estimatedWaitMinutes: 28 }),
  // Completed tokens (for history / display)
  makeToken({ id: "t-100", tokenNumber: "Q-10", centreId: "cedar-bay-clinic", serviceId: "gp", customerId: "c-100", customerName: "Past User", position: 0, joinedAt: minsAgo(120), status: "COMPLETED", counterId: "cbc-c1", calledAt: minsAgo(100), servedAt: minsAgo(98), completedAt: minsAgo(85), estimatedWaitMinutes: 0 }),
  makeToken({ id: "t-101", tokenNumber: "Q-11", centreId: "cedar-bay-clinic", serviceId: "gp", customerId: "c-101", customerName: "Past User", position: 0, joinedAt: minsAgo(115), status: "COMPLETED", counterId: "cbc-c1", calledAt: minsAgo(90), servedAt: minsAgo(88), completedAt: minsAgo(75), estimatedWaitMinutes: 0 }),
  makeToken({ id: "t-102", tokenNumber: "B-01", centreId: "northwharf-bank", serviceId: "teller", customerId: "c-102", customerName: "Past User", position: 0, joinedAt: minsAgo(130), status: "COMPLETED", counterId: "nwb-c1", calledAt: minsAgo(110), servedAt: minsAgo(108), completedAt: minsAgo(100), estimatedWaitMinutes: 0 }),
];

// ─── Compose initial QueueState per centre ────────────────────────────────────

function buildQueueState(centreId: string): QueueState {
  const tokens = mockTokens.filter(
    (t) => t.centreId === centreId && t.status !== "COMPLETED" && t.status !== "CANCELLED",
  );
  const counters = mockCounters[centreId] ?? [];
  // Wire serving tokens to counters
  const withCounters = counters.map((c) => {
    const serving = tokens.find(
      (t) => t.counterId === c.id && t.status === "SERVING",
    );
    return { ...c, currentTokenId: serving?.id };
  });
  return {
    centreId,
    status: "OPEN",
    tokens,
    counters: withCounters,
    lastUpdated: NOW.toISOString(),
  };
}

export const initialQueues: Record<string, QueueState> = {
  "cedar-bay-clinic": buildQueueState("cedar-bay-clinic"),
  "northwharf-bank": buildQueueState("northwharf-bank"),
  "civic-records": buildQueueState("civic-records"),
  "linden-studio": {
    centreId: "linden-studio",
    status: "OPEN",
    tokens: [],
    counters: [
      { id: "ls-c1", centreId: "linden-studio", name: "Chair 1", number: 1, status: "ACTIVE", staffName: "Marco", serviceIds: ["cut", "colour"] },
      { id: "ls-c2", centreId: "linden-studio", name: "Chair 2", number: 2, status: "ACTIVE", staffName: "Isla", serviceIds: ["cut"] },
    ],
    lastUpdated: NOW.toISOString(),
  },
};
