import type { Notification } from "../../types/queue";

export const seedNotifications: Notification[] = [
  {
    id: "n-001",
    type: "JOINED",
    title: "You joined the queue",
    message: "Your token is Q002 at Cedar Bay Clinic. 1 person is ahead of you.",
    tokenId: "t-002",
    read: true,
    createdAt: new Date(Date.now() - 55 * 60000).toISOString(),
  },
  {
    id: "n-002",
    type: "APPROACHING",
    title: "Almost your turn",
    message: "3 people are now ahead of you. Estimated wait: about 24 minutes.",
    tokenId: "t-002",
    read: false,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
];
